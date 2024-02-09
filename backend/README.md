# Proyecto deteccion de neumonia utilizando imagenes de rayos x

Pasos a seguir para que funcione el proyecto

1. Clonar este repositorio
2. Entorno virtual en (Linux Ubuntu)
    
    * Crear entorno virtual  
    
    
    python3 -m virtualenv venv
    
    
    * Activar entorno virtual 
    
    
    source venv/bin/activate
    
    
    * Desactivar entorno virtual 
    
    
    deactivate
    

2. Entorno virtual en Windows
    * Crear entorno virtual
    
    
    python -m virtualenv venv
    
    
    *  Activar entorno virtual 
    
    
    .\venv\Scripts\activate
    
    
    * Desactivar entorno virtual 
    
    
    deactivate
    

Nota: Los siguientes comando se deben ejecutar con el entorno virtual activado

4. Instalaciones necesarias (Ejecutar)

    
    pip install -r requirement.txt
    

5. Iniciar el proyecto 
    
    * Linux Ubuntu
    
    
    python3 index.py
    

    * Windows
    
    
    python3 index.py
    

6. Adicional
    * Los siguientes campos deben estar en un archivo llamado .env
    
    SECRET_KEY=
    JWT_KEY=
    MYSQL_HOST=
    MYSQL_USER=
    MYSQL_PASSWORD=
    MYSQL_DB=
    
7. Comando adicional 
    * Comando par guardar los paquetes instalados de nuestro entorno virtual.
    
    
    pip freeze > requirements.txt
    