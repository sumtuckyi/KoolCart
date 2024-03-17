FROM python:3.9.13
ENV PYTHONUNBUFFERED 1
WORKDIR /code
COPY requirements.txt /code/
COPY . /code/
RUN pip install -r requirements.txt
RUN mkdir -p /var/lib/sqlite && mv /code/db.sqlite3 /var/lib/sqlite/
CMD ["python", "/code/manage.py", "runserver", "0.0.0.0:8000"]
