import os
import torch
import base64
from io import BytesIO
from diffusers import pipelines, schedulers
from utils.filesystem import FilesystemUtils
from utils.image import ImageUtils

torch.backends.cuda.matmul.allow_tf32 = True

class SdService:
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  difussers_dir = "api/weights/sd/difussers"

  def load_scheduler(model, sampler):
      match sampler:
          case 'euler_a':
              scheduler = schedulers.EulerAncestralDiscreteScheduler.from_pretrained(
                  model,
                  subfolder="scheduler"
              )
          case 'euler':
              scheduler = schedulers.EulerDiscreteScheduler.from_pretrained(
                  model,
                  subfolder="scheduler"
              )
          case 'ddim':
              scheduler = schedulers.DDIMScheduler.from_pretrained(
                  model,
                  subfolder="scheduler"
              )
          case 'ddpm':
              scheduler = schedulers.DDPMScheduler.from_pretrained(
                  model,
                  subfolder="scheduler"
              )
          case 'uni_pc':
              scheduler = schedulers.UniPCMultistepScheduler.from_pretrained(
                  model,
                  subfolder="scheduler"
              )
          case _:
              raise ValueError("Invalid sampler type")

      return scheduler
      
  def load_model(model, sampler):
      diffuser = os.path.join(SdService.difussers_dir, model)
      scheduler = SdService.load_scheduler(diffuser, sampler)
      pipe = pipelines.StableDiffusionInpaintPipeline.from_pretrained(
          diffuser,
          scheduler=scheduler,
          revision="fp16",
          safety_checker=None,
          torch_dtype=torch.float16,
      ).to(SdService.device)

      # pipe.enable_sequential_cpu_offload()
      # pipe.enable_attention_slicing()
      # pipe.enable_model_cpu_offload() 
      # pipe.enable_vae_slicing() 
      # pipe.enable_vae_tiling() 

      return pipe

  def latents_callback(step, latents, pipe, emit_progress):
    if step % 5 == 0:
      latents = 1 / 0.18215 * latents
      image = pipe.vae.decode(latents).sample[0]
      image = (image / 2 + 0.5).clamp(0, 1)
      image = image.cpu().permute(1, 2, 0).numpy()
      image = pipe.numpy_to_pil(image)[0]
      buffered = BytesIO()
      image.save(buffered, format="JPEG")
      image = "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")
      emit_progress({ "image": image, "step": step })
    else:
      emit_progress({ "step": step })

  def inpaint(properties, image, mask, emit_progress):
      pipe = SdService.load_model(properties.model, properties.sampler)
      width, height = ImageUtils.proportion(image, properties.width, properties.height)
      image = ImageUtils.resize(image, properties.width, properties.height)
      mask = ImageUtils.resize(mask, properties.width, properties.height)
      outputs = []

      for i in range(properties.images):
        output = pipe(
            image=image,
            mask_image=mask,
            prompt=properties.positive,
            negative_prompt=properties.negative,
            num_inference_steps=properties.steps,
            guidance_scale=properties.cfg,
            num_images_per_prompt=1,
            width=properties.width,
            height=properties.height,
            callback_steps=1,
            callback=lambda s, _, l: SdService.latents_callback(((s + 1) + (i * properties.steps)), l, pipe, emit_progress),
            eta=0.0,
        ).images[0]

        image = ImageUtils.crop(image, width, height)
        output = ImageUtils.crop(output, width, height)
        mask = ImageUtils.crop(mask, width, height)
        output = ImageUtils.mask(image, output, mask)
        outputs.append(output)

      torch.cuda.empty_cache()

      return outputs

  def get_models():
      return FilesystemUtils.ls(SdService.difussers_dir, "dir")

  def get_samplers():
      return [
        {
            "label": "Euler A",
            "value": "euler_a"
        },
        {
            "label": "Euler",
            "value": "euler"
        },
        {
            "label": "DDIM",
            "value": "ddim"
        },
        {
            "label": "DDPM",
            "value": "ddpm"
        },
        {
            "label": "UniPC",
            "value": "uni_pc"
        },
    ]