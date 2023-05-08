import os
from datetime import datetime

class FilesystemUtils:
  def ls(path, type="file"):
      result = os.listdir(path)
      if type == "file":
          return [f for f in result if os.path.isfile(os.path.join(path, f))]
      elif type == "dir":
          return [f for f in result if os.path.isdir(os.path.join(path, f))]
      else:
          return []
  
  def mkdir(path):
      os.makedirs(path, exist_ok=True)

  def rm(path):
      os.remove(path)

  def rmdir(path):
      os.rmdir(path)

  def read(path):
      with open(path, 'r') as f:
          return f.read()