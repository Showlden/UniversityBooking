from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = (
        ('student', 'Студент'),
        ('teacher', 'Преподаватель'),
        ('staff', 'Персонал'),
        ('admin', 'Администратор'),
    )
    
    role = models.CharField(max_length=10, choices=ROLES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"