# Generating the Knowledge Graph

This guide explains how to generate a knowledge graph from an Excel file. Follow these steps to ensure a successful generation of the knowledge graph.

## Prerequisites

Ensure that Python and pip are installed on your system. If not, follow the instructions [here](https://www.python.org/downloads/) to install them.

## Installing Dependencies

All necessary libraries are listed in `requirements.txt`. To install them, run the following command:

```bash
pip install -r requirements.txt
```

## Preparing the Excel File

The Excel file should follow the format specified in `excel_data/file1.xlsx`. Ensure that your data is organized similarly to avoid errors during processing.

## Updating Metadata

Update the metadata of the Excel file in `data.json` carefully. This step is crucial as it ensures the correct interpretation of your data.

## Generating the Knowledge Graph

Once the dependencies are installed, the Excel file is formatted correctly, and the metadata is updated, you can generate the knowledge graph by running the program. The data will be converted into a knowledge graph and saved as `generatedRDF/knowledgeGraph.ttl`.

## Example Commands

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Prepare your Excel file:**
   Ensure it follows the structure of `excel_data/file1.xlsx`.

3. **Update metadata:**
   Edit `data.json` to reflect the structure and content of your Excel file.

4. **Run the program:**
   Execute the script to generate the knowledge graph. The output will be saved in `generatedRDF/knowledgeGraph.ttl`.

## Note

Carefully follow the steps to avoid any errors. If you encounter any issues, double-check the format of your Excel file and the metadata in `data.json`.

---

By following this guide, you should be able to generate a knowledge graph successfully. If you have any questions or need further assistance, please refer to the documentation or seek help from the community.

#

#

# For Developers Only

# Steps to setup the programming Environment

- setup Enviroumnet
- activate environment
- install the requirements
- run the `jupyter nbconvert --execute Climate_Bowl.ipynb --to html`

## Environment Setup

### Setup Python Virtual Env

```bash
python -m venv env
```

### Activate Environment

```bash
# command prompt
.\env\Scripts\activate

# powershell
.\env\Scripts\Activate.ps1|

# additional command for windows if the above command give error for Execution policies
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### install requirements

```bash
pip install -r requirements.txt
```

### Deactivate Environment

```bash
deactivate
```

### update reqirements.txt file

```bash
pip freeze > requirements.txt
```
