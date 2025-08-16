from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BuildingViewSet,
    RoomViewSet,
    BookingViewSet,
)

router = DefaultRouter()
router.register(r'buildings', BuildingViewSet, basename='building')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]