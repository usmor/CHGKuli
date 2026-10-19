# 🎲 CHGKuli

> **Web application for playing "What? Where? When?"** — a popular Russian intellectual quiz game.
> Built on a dataset of **330,000+ questions** from over **5,500 tournaments**.

🔗 **[Live Demo](https://chgkuli.up.railway.app/)** · **[API Docs (Swagger)](https://chgkuli-production.up.railway.app/docs)**

---

## Key Features

- **Flexible question search**: filter by author, tournament, and year. Infinite scroll across the entire database.
- **Game mode**: customizable question count, optional per-question timer, pause.
- **Personal statistics**: passed questions, games played, total time spent, and days since registration.
- **Game history**: detailed breakdown of past games: team composition, questions marked ✅/❌, and the ability to continue an unfinished game.
- **Authorization**: daily personal code for inviting players to a game.
- **Guest mode**: start playing without signing up and save your results later by logging in at any moment.

**Current limitations:**
- ⚠️ **No mobile version yet** — the interface is optimized for desktop screens. Mobile responsiveness is on the roadmap.

---

## 🛠 Tech Stack

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-4B3263?style=flat-square)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=flat-square)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-2D3748?style=flat-square)

### Deployment
![Railway](https://img.shields.io/badge/Railway-131415?style=flat-square&logo=railway&logoColor=white)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

*The question database is sourced from [db.chgk.info](https://db.chgk.info) and belongs to the original authors. The license applies only to the application code.*

## Author
Anna Lutsenko — Frontend Developer with a background in computational linguistics.

✉️ annalutsenko281@gmail.com
