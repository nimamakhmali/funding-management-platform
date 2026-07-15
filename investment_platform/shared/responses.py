"""
Response های استاندارد API
"""
from rest_framework.response import Response
from rest_framework import status


def success_response(data=None, message: str = "", status_code: int = 200) -> Response:
    payload: dict = {"success": True}
    if message:
        payload["message"] = message
    if data is not None:
        payload["data"] = data
    return Response(payload, status=status_code)


def error_response(message: str, code: str = "error", status_code: int = 400) -> Response:
    return Response(
        {"success": False, "error": message, "code": code},
        status=status_code,
    )


def created_response(data=None, message: str = "با موفقیت ایجاد شد.") -> Response:
    return success_response(data=data, message=message, status_code=status.HTTP_201_CREATED)
