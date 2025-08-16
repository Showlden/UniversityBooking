from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model

User = get_user_model()

class Building(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name

class Room(models.Model):
    TYPES = (
        ('lecture', 'Лекционная'),
        ('lab', 'Лаборатория'),
        ('conference', 'Конференц-зал'),
        ('other', 'Другое'),
    )
    
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms')
    number = models.CharField(max_length=20)
    type = models.CharField(max_length=20, choices=TYPES)
    capacity = models.PositiveIntegerField()
    floor = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    has_projector = models.BooleanField(default=False)
    has_whiteboard = models.BooleanField(default=False)
    has_computers = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('building', 'number')
    
    def __str__(self):
        return f"{self.building.name}, ауд. {self.number}"

class Booking(models.Model):
    STATUSES = (
        ('pending', 'Ожидает подтверждения'),
        ('approved', 'Подтверждено'),
        ('rejected', 'Отклонено'),
        ('canceled', 'Отменено'),
    )
    
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    purpose = models.TextField()
    status = models.CharField(max_length=10, choices=STATUSES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.room} ({self.start_time} - {self.end_time})"