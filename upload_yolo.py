from roboflow import Roboflow

rf = Roboflow(api_key="9sFbk6RHMD4a0PraAavH")
workspace = rf.workspace("polderr/")

workspace.deploy_model(
    model_type="yolo26n-cls",  # Type of the model
    model_path="weights",  # Path to model directory
    project_ids=["site-marshall-class"],  # List of project IDs
    model_name="yolo26n-cls",  # Name for the model (must have at least 1 letter, and accept numbers and dashes)
    filename="best.pt"  # Path to weights file (default)
)