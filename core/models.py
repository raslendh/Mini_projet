from datetime import date

from django.db import models, transaction


class Student(models.Model):
    class Department(models.TextChoices):
        INFORMATIQUE = "Informatique"
        PHYSIQUE = "Physique"
        MATHEMATIQUES = "Mathematiques"
        CHIMIE = "Chimie"
        GENIE_CIVIL = "Genie Civil"
        ELECTRONIQUE = "Electronique"

    class Status(models.TextChoices):
        ACTIF = "Actif"
        DIPLOME = "Diplome"
        SOUTENANCE = "Soutenance"

    name = models.CharField(max_length=200)
    email = models.EmailField()
    matricule = models.CharField(max_length=64, unique=True, blank=True, default="")
    department = models.CharField(max_length=40, choices=Department.choices)
    year = models.CharField(max_length=20)
    average = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIF)

    phone = models.CharField(max_length=40, blank=True, default="")
    city = models.CharField(max_length=200, blank=True, default="")
    birth_date = models.CharField(max_length=40, blank=True, default="")
    formation = models.CharField(max_length=200, blank=True, default="")

    inscription_date = models.DateField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.matricule})"

    @classmethod
    def _generate_matricule(cls, year: int) -> str:
        prefix = f"ETU-{year}-"
        last = (
            cls.objects.filter(matricule__startswith=prefix)
            .order_by("-matricule")
            .values_list("matricule", flat=True)
            .first()
        )
        last_num = 0
        if last:
            try:
                last_num = int(str(last).split("-")[-1])
            except ValueError:
                last_num = 0
        return f"{prefix}{last_num + 1:03d}"

    def save(self, *args, **kwargs):
        if not self.matricule:
            with transaction.atomic():
                year = (self.inscription_date.year if self.inscription_date else date.today().year)
                self.matricule = self._generate_matricule(year)
                return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)
