Фронт приложения "Магический шар"

Бек(https://github.com/SadFox16/Python-magic8ball)

Приложение реализовано в виде SPA, отсутствует разбивка на компоненты.

При открытии страницы пользователю предлагается авторизоваться, также доступна регистарция. Данные пользователей хранятся на сервере, для авторизации используются JWT токены. Выход из учетной записи осуществляется путем удаления токена из localStorage.

После создания учетной записи(или авторизации) открывается главная форма, где можно задать любой вопрос и получить на него один из 8 заготовленных ответов. Ответы хранятся в таблице на сервере. Также присутствует счетчик, показывающий количество повторений заданного вопроса.

Также в проекте предусмотрено сохранение истории - в отдельной таблице на сервере сохраняется ID пользователя, его вопрос и полученный ответ.

Реализован вывод ошибок на всех этапах, которые берутся из ответов сервера на запросы. Все запросы обрабатываются сервером на Django Rest Framework.

Реализованы кастомные стили CSS для элементов форм и страницы.
