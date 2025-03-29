from django.db import models

class TeacherRegistration(models.Model):
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    institution = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    confirm_password = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

class TeacherLogin(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)

    def __str__(self):
        return self.email

class StudentRegistration(models.Model):
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    birthdate = models.DateField()
    password = models.CharField(max_length=200)
    confirm_password = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    
class StudentLogin(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)

    def __str__(self):
        return self.email