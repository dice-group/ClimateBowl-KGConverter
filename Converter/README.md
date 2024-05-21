# Steps to run the program

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
