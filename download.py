from huggingface_hub import hf_hub_download

model_path = hf_hub_download(repo_id="openvision/yolo26-n-cls", filename="model.pt")
print(model_path)