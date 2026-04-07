# 🇹🇭 THAIVEL: Experience the Vibrant Soul of Thailand

**THAIVEL** is a sophisticated full-stack travel platform designed to bridge the gap between curious travelers and the authentic cultural essence of Thailand. Developed as a showcase for the **International Web Design Contest (iWDC)**, this project highlights modern web standards, responsive design, and AI integration to simplify travel discovery.

## 📝 Abstract

In a world of information overload, THAIVEL provides a curated, aesthetically pleasing gateway to Thailand’s diverse attractions. From the misty mountains of the North to the pristine beaches of the South, the platform organizes destinations by region and interest, allowing users to find their perfect trip through an intuitive, data-driven interface.

## 🔭 Vision

To create a "street-smart" digital companion that embodies Thai hospitality. THAIVEL isn't just a directory; it's a vision of future tourism where technology—specifically AI and responsive web architecture—enhances the connection between people and places.

## ✨ Key Features

* **Regional Exploration:** A comprehensive breakdown of Thailand’s 6 unique regions with localized culture, food, and landmark insights.
* **Smart Categorization:** Filterable discovery engine for **Cafes, Nature, Restaurants, Street Food, Temples,** and **Urban** destinations.
* **🛺 Tuktuk Driver AI:** A custom-engineered AI travel assistant that provides conversational recommendations and local "wisdom" to help users plan their adventures.
* **Interactive Cartography:** Integrated dark-themed maps with custom pins for visual spatial orientation across the Kingdom.
* **Mobile-First Architecture:** A fully responsive design that maintains high-fidelity visuals and usability on smartphones for travelers on the go.
* **Social & Navigational Integration:** Direct links to Instagram, Facebook, TikTok, and Google Maps for every featured location.

## 🛠️ Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [MySQL](https://www.mysql.com/) for structured destination and regional data management.

## 📸 Preview

### Desktop Interface
<p align="center">
  <img src="images/desktop/desktop_1.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_2.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_3.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_4.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_5.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_6.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_7.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_8.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_9.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_10.jpeg" width="30%" alt="">
  <img src="images/desktop/desktop_11.jpeg" width="30%" alt="">
</p>

### Mobile Interface

<p align="center">
  <img src="images/smartphone/smartphone_1.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_2.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_3.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_4.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_5.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_6.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_7.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_8.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_9.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_10.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_11.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_12.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_13.png" width="30%" alt="">
  <img src="images/smartphone/smartphone_14.png" width="30%" alt="">
</p>

## ⚠️ Note

**Authenticity & Originality:** All visual assets, including photography and AI-generated elements, are my own original creations. This project represents a complete, self-contained creative and technical effort.

---

### 👨‍💻 Developer

**Phanlop Boonluea (Auto)** *Computer Engineering Student, RMUTT*

---

## Aiven Database + Netlify Deployment

This project uses `mysql2`, so connect it to **Aiven MySQL**.

### 1. Create environment variables

Set these values locally (root `.env.local`) and in Netlify (Site settings > Environment variables):

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_SSL=true`
- `MYSQL_SSL_REJECT_UNAUTHORIZED=true`
- `MYSQL_CA_CERT` (paste the full Aiven CA certificate)

If your CA is hard to paste as multiline text, use base64 format instead:

- `MYSQL_CA_CERT_BASE64`

and leave `MYSQL_CA_CERT` empty.

### 2. Import schema/data into Aiven

Run your SQL files against the Aiven database:

- `sql/database.sql`
- `sql/provinces.sql`
- `sql/category.sql`
- `sql/attractions.sql`

### 3. Deploy to Netlify

1. Push this repository to GitHub.
2. In Netlify, click **Add new site** > **Import an existing project**.
3. Select this repository.
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add all environment variables listed above.
7. Deploy.

`netlify.toml` is included and enables the Next.js runtime plugin.