# Система управления логистикой и запасами

Этот проект является дипломной работой для **Caspian College** на тему:
> "Разработка сайта интернет-магазина по продаже электронной техники."

## Стек технологий

- **Frontend**: [Nuxt 3](https://nuxt.com/docs/getting-started/introduction) — современный фреймворк для создания Vue-приложений.
- **Backend**: [Laravel](https://laravel.com/) — мощный PHP-фреймворк с интуитивно понятной архитектурой.
- **База данных**: [MySQL](https://www.mysql.com/) — реляционная база данных для надёжного хранения данных.

## Основные возможности

- **Оптимизация логистики**: Автоматическое планирование маршрутов доставки и снижение транспортных затрат.
- **Управление запасами**: Мониторинг остатков, учёт поступлений и отгрузок товаров, создание отчетности и ведение учёта на складе.
- **Пользовательский интерфейс**: Интуитивно понятный интерфейс, разработанный с использованием Nuxt 3, для быстрого и удобного взаимодействия с системой.

## Установка и запуск

### Требования

- Node.js: 20.11.1
- PHP: 8.2
- MySQL
- Composer

### Установка

1. Клонируйте репозиторий:
   
   ```bash
   git clone https://github.com/Zh3nyaZh3nya/logistic-project.git
   cd logistic-project

3. Установите зависимости для frontend:
   
   ```bash
   cd frontend
   yarn install

3. Установите зависимости для backend:

   ```bash
   cd ../backend
   composer install

## Настройте файл окружения .env для frontend и backend частей. Примерные файлы .env.example можно найти в папках frontend и backend.

4. Выполните миграции базы данных:

   ```bash
   php artisan migrate

### Запустите сервер разработки.

- Для backend:

   ```bash
   php artisan serve

- Для frontend:

  ```bash
  yarn dev

## Структура проекта
frontend/ - Nuxt 3 проект для интерфейса пользователя

backend/ - Laravel проект для серверной части приложения

## Контакты
Для вопросов и предложений свяжитесь со мной по email: evgeniq.golovkin@gmail.com или https://t.me/Zh3nya_qwe.
