from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import socket
import geoip2.database
import httpx
import time
from urllib.parse import urlparse
from fastapi.middleware.cors import CORSMiddleware
import ssl
from time import perf_counter

app = FastAPI()

app.add_middleware( 
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)


class WebsiteRequest(BaseModel):
    url: str


@app.post("/analyze")
def analyze(data: WebsiteRequest):

    url = data.url.strip()
    
    if not url:
        raise HTTPException(
            status_code=400,
            detail="Website URL cannot be empty."
        )

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed_url = urlparse(url)

    domain = parsed_url.netloc.lower()


    start_time = time.time()
    
    try:
        ip_address = socket.gethostbyname(domain)

    except socket.gaierror:
        raise HTTPException(
            status_code=400,
            detail="Unable to resolve domain. Please enter a valid website URL."
        )

    reader = geoip2.database.Reader("data/GeoLite2-City.mmdb")

    try:
        response = reader.city(ip_address)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to determine server location for this target."
    )
        
    port = 443 if parsed_url.scheme == "https" else 80

    try:
        tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        tcp_socket.settimeout(10)

        tcp_start = perf_counter()

        tcp_socket.connect((ip_address, port))

        tcp_connect_ms = round(
            (perf_counter() - tcp_start) * 1000,
            2
        )

        tcp_socket.close()

    except Exception as e:
        raise HTTPException(
            status_code=408,
            detail=f"TCP connection failed: {e}"
    )

    try:
        with httpx.stream("GET", url, timeout=10) as r:
            next(r.iter_bytes())

    except Exception as e:
        print("HTTPX ERROR:", repr(e))

        raise HTTPException(
            status_code=408,
            detail=repr(e)
        )
    
    response_time_ms = round((time.time() - start_time) * 1000, 2)

    if response_time_ms < 200:
        grade = "A+"
        status = "Excellent"

    elif response_time_ms < 500:
        grade = "A"
        status = "Very Fast"

    elif response_time_ms < 800:
        grade = "B"
        status = "Good"

    elif response_time_ms < 1200:
        grade = "C"
        status = "Fair"

    elif response_time_ms < 2000:
        grade = "D"
        status = "Slow"

    else:
        grade = "F"
        status = "Critical"

    return {
        "url": url,
        "ip_address": ip_address,
        "country": response.country.name,
        "city": response.city.name,
        "latitude": response.location.latitude,
        "longitude": response.location.longitude,
        "tcp_connect_ms": tcp_connect_ms,
        "response_time_ms": response_time_ms,
        "grade": grade,
        "status": status
    }