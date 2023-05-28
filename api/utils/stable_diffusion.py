import gc
import os
import re
import torch
from diffusers import pipelines, schedulers
from utils.filesystem import FilesystemUtils
from utils.pillow import PillowUtils

torch.backends.cuda.matmul.allow_tf32 = True

class StableDiffusion:

  def __init__(self, models_path, device):
    self.device = device
    self.models_path = models_path

  def load_scheduler(self, sampler, config):
      match sampler:
          case 'euler_a':
              scheduler = schedulers.EulerAncestralDiscreteScheduler.from_config(config)
          case 'euler':
              scheduler = schedulers.EulerDiscreteScheduler.from_config(config)
          case 'ddim':
              scheduler = schedulers.DDIMScheduler.from_config(config)
          case 'ddpm':
              scheduler = schedulers.DDPMScheduler.from_config(config)
          case 'uni_pc':
              scheduler = schedulers.UniPCMultistepScheduler.from_config(config)
          case _:
              raise ValueError("Invalid sampler type")

      return scheduler
      
  def load_model(self, type, model):
      match type:
          case 'inpaint':
              pipe = pipelines.StableDiffusionInpaintPipeline.from_pretrained(
                  os.path.join(self.models_path, model),
                  revision="fp16",
                  safety_checker=None,
                  torch_dtype=torch.float16,
              )
          case 'txt2img':
              pipe = pipelines.StableDiffusionPipeline.from_pretrained(
                  os.path.join(self.models_path, model),
                  revision="fp16",
                  safety_checker=None,
                  torch_dtype=torch.float16,
              )
          case 'pix2pix':
              pipe = pipelines.StableDiffusionInstructPix2PixPipeline.from_pretrained(
                  "timbrooks/instruct-pix2pix",
                  revision="fp16",
                  safety_checker=None,
                  torch_dtype=torch.float16,
              )
          case 'img2img':
              pipe = pipelines.StableDiffusionImg2ImgPipeline.from_pretrained(
                  os.path.join(self.models_path, model),
                  revision="fp16",
                  safety_checker=None,
                  torch_dtype=torch.float16,
              )
          case _:
              raise ValueError("Invalid model type")
          
      return pipe

  def load_generator(self, seed):
      return torch.Generator(self.device).manual_seed(seed)

  def latents_callback(self, step, latents, pipe, emit_progress):
      emit_progress({ "step": step })
        # latents = 1 / self.vae.config.scaling_factor * latents
        # image = self.vae.decode(latents).sample
        # image = (image / 2 + 0.5).clamp(0, 1)
        # # we always cast to float32 as this does not cause significant overhead and is compatible with bfloat16
        # image = image.cpu().permute(0, 2, 3, 1).float().numpy()
        # return image
    # if step % 5 == 0:
    #   latents = 1 / 0.18215 * latents
    #   image = pipe.vae.decode(latents).sample[0]
    #   image = (image / 2 + 0.5).clamp(0, 1)
    #   image = image.cpu().permute(1, 2, 0).numpy()
    #   image = pipe.numpy_to_pil(image)[0]
    #   buffered = BytesIO()
    #   image.save(buffered, format="JPEG")
    #   image = "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")
    #   emit_progress({ "image": image, "step": step })
    # else:
    #   emit_progress({ "step": step })

  def inpaint(self, image, mask, properties, emit_progress):
      pipe = self.load_model('inpaint', properties.model)
      pipe.scheduler = self.load_scheduler(properties.sampler, pipe.scheduler.config)
      pipe.to(self.device)
      generator = self.load_generator(properties.seed)

      width, height = PillowUtils.proportion(image, properties.width, properties.height)
      image = PillowUtils.resize(image, properties.width, properties.height)
      mask = PillowUtils.resize(mask, properties.width, properties.height)
      
      outputs = []

      for i in range(properties.images):
        [output] = pipe(
            image=image,
            mask_image=mask,
            prompt=properties.positive,
            negative_prompt=properties.negative,
            num_inference_steps=properties.steps,
            guidance_scale=properties.cfg,
            num_images_per_prompt=1,
            width=properties.width,
            height=properties.height,
            generator=generator,
            callback_steps=1,
            callback=lambda s, _, l: self.latents_callback(((s + 1) + (i * properties.steps)), l, pipe, emit_progress),
            eta=0.0,
        ).images

        image = PillowUtils.crop(image, width, height)
        output = PillowUtils.crop(output, width, height)
        mask = PillowUtils.crop(mask, width, height)
        output = PillowUtils.mask(image, output, mask)
        outputs.append(output)

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()

      del pipe
      del generator
      gc.collect()

      return outputs

  def txt2img(self, properties, emit_progress):
      pipe = self.load_model('txt2img', properties.model)
      pipe.scheduler = self.load_scheduler(properties.sampler, pipe.scheduler.config)
      pipe.to(self.device)
      generator = self.load_generator(properties.seed)

      outputs = []

      for i in range(properties.images):
        output = pipe(
            prompt=properties.positive,
            negative_prompt=properties.negative,
            num_inference_steps=properties.steps,
            guidance_scale=properties.cfg,
            num_images_per_prompt=1,
            width=properties.width,
            height=properties.height,
            generator=generator,
            callback_steps=1,
            callback=lambda s, _, l: self.latents_callback(((s + 1) + (i * properties.steps)), l, pipe, emit_progress),
            eta=0.0,
        ).images[0]

        outputs.append(output)

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()

      del pipe
      del generator
      gc.collect()

      return outputs
  
  def img2img(self, image, properties, emit_progress):
      pipe = self.load_model('img2img', properties.model)
      pipe.scheduler = self.load_scheduler(properties.sampler, pipe.scheduler.config)
      generator = self.load_generator(properties.seed)

      width, height = PillowUtils.proportion(image, properties.width, properties.height)
      image = PillowUtils.resize(image, properties.width, properties.height).convert("RGB")

      outputs = []

      for i in range(properties.images):
          output = pipe(
              image=image,
              prompt=properties.positive,
              negative_prompt=properties.negative,
              num_inference_steps=properties.steps,
              guidance_scale=properties.cfg,
              num_images_per_prompt=1,
              generator=generator,
              callback_steps=1,
              callback=lambda s, _, l: self.latents_callback(((s + 1) + (i * properties.steps)), l, pipe, emit_progress),
              eta=0.0,
          ).images[0]

          output = PillowUtils.crop(output, width, height)

          outputs.append(output)

          if torch.cuda.is_available():
              torch.cuda.empty_cache()
              torch.cuda.ipc_collect()

      del pipe
      del generator
      gc.collect()

      return outputs
  
  def pix2pix(self, image, properties, emit_progress):
      pipe = self.load_model('pix2pix', properties.model)
      pipe.scheduler = self.load_scheduler(properties.sampler, pipe.scheduler.config)
      pipe.enable_sequential_cpu_offload()
      pipe.enable_attention_slicing()
      generator = self.load_generator(properties.seed)

      width, height = PillowUtils.proportion(image, properties.width, properties.height)
      image = PillowUtils.resize(image, properties.width, properties.height).convert("RGB")

      outputs = []

      for i in range(properties.images):
          output = pipe(
              image=image,
              prompt=properties.positive,
              negative_prompt=properties.negative,
              num_inference_steps=properties.steps,
              guidance_scale=properties.cfg,
              num_images_per_prompt=1,
              generator=generator,
              callback_steps=1,
              callback=lambda s, _, l: self.latents_callback(((s + 1) + (i * properties.steps)), l, pipe, emit_progress),
              eta=0.0,
          ).images[0]

          output = PillowUtils.crop(output, width, height)

          outputs.append(output)

          if torch.cuda.is_available():
              torch.cuda.empty_cache()
              torch.cuda.ipc_collect()

      del pipe
      del generator
      gc.collect()

      return outputs
     
  def get_models(self):
      models = FilesystemUtils.ls(self.models_path, "dir")
      return [{ "label": re.sub(r'[-_]', ' ', model).title(), "value": model } for model in models]

  @staticmethod
  def get_samplers():
      return [
          { "label": "Euler A", "value": "euler_a" },
          { "label": "Euler", "value": "euler" },
          { "label": "DDIM", "value": "ddim" },
          { "label": "DDPM", "value": "ddpm" },
          { "label": "UniPC", "value": "uni_pc" },
      ]
