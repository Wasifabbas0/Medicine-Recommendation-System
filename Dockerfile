FROM python:3.10

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

COPY --chown=user . .
RUN pip install --no-cache-dir -r backend/requirements.txt

EXPOSE 7860

CMD ["python", "backend/run.py"]