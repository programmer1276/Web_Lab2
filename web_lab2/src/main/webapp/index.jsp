<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="org.example.Result" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Web-Programming Lab1</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./styles/general.css">
    <link rel="stylesheet" href="./styles/header.css">
    <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
<header>
    <table id="logo">
        <tr>
            <td class="name-itmo">
                <img class="cs-logo" src="./images/itmo-name.png" alt="CS Logo">
            </td>
        </tr>
    </table>
    <table id="header-table" border="1">
        <tr>
            <td class="left-section">
                <img class="itmo-logo-light" src="./images/itmo-duck-large-black-bg.png" alt="ITMO Logo">
            </td>
            <td class="middle-section">
                Лабораторная работа №1
            </td>
            <td class="right-section">
                <p>Кравцев Вадим</p>
                <p>Группа: Р3214</p>
                <p>Вариант: 408889</p>
            </td>
        </tr>
    </table>
</header>

<main class="main">
    <table id="layout-table">
        <tr>
            <td class="main-left-section">
                <div class="area">
                    <canvas id="graph" width="500" height="500" style="border:1px solid black;"></canvas>
                </div>
                <form class="coords-form" id="pointForm" method="GET" action="controller">
                    <label for="x-coord-input">Выберите значение для X:</label>
                    <div class="checkboxes">
                        <input type="checkbox" id="x1" name="x" value="-2">
                        <label for="x1">-2</label>
                        <input type="checkbox" id="x2" name="x" value="-1.5">
                        <label for="x2">-1.5</label>
                        <input type="checkbox" id="x3" name="x" value="-1">
                        <label for="x3">-1</label>
                        <input type="checkbox" id="x4" name="x" value="-0.5">
                        <label for="x4">-0.5</label>
                        <input type="checkbox" id="x5" name="x" value="0">
                        <label for="x5">0</label>
                        <input type="checkbox" id="x6" name="x" value="0.5">
                        <label for="x6">0.5</label>
                        <input type="checkbox" id="x7" name="x" value="1">
                        <label for="x7">1</label>
                        <input type="checkbox" id="x8" name="x" value="1.5">
                        <label for="x8">1.5</label>
                        <input type="checkbox" id="x9" name="x" value="2">
                        <label for="x9">2</label>
                    </div>
                    <label for="y-coord-input">Введите значение для Y:</label>
                    <p style="font-size: 10px;">Данное значение должно быть в диапазоне (-5,5)</p>
                    <input type="text" name="y" id="y-coord-input" placeholder="Введите Y" />
                    <label for="r-coord-input">Введите значение для R:</label>
                    <p style="font-size: 10px;">Данное значение должно быть в диапазоне (2,5)</p>
                    <input type="text" name="r" id="r-coord-input" placeholder="Введите R" />
                    <button id="js-submit-button" type="submit">Отправить</button>
                </form>
                <p class="js-validation-message"></p>
            </td>

            <td class="main-right-section">
                <table id="response-table" border="1">
                    <caption>Результаты</caption>
                    <thead>
                        <tr>
                            <th>Результат</th>
                            <th>X</th>
                            <th>Y</th>
                            <th>R</th>
                            <th>Время</th>
                            <th>Время обработки</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            List<Result> results = (List<Result>) application.getAttribute("results");
                            if (results != null) {
                                for (Result result : results) {
                        %>
                        <tr>
                            <td><%= result.isHit() ? "Попадание" : "Промах" %></td>
                            <td><%= result.getX() %></td>
                            <td><%= result.getY() %></td>
                            <td><%= result.getR() %></td>
                            <td><%= result.getCurrentTime() %></td>
                            <td><%= result.getExecutionTime() %></td>
                        </tr>
                        <%
                                }
                            } else {
                        %>
                        <tr>
                            <td colspan="6">Нет данных</td>
                        </tr>
                        <%
                            }
                        %>
                    </tbody>
                </table>
                <p id="js-logs-from-server"></p>
            </td>
        </tr>
    </table>
</main>

<script src="./scripts/index.js"></script>
</body>
</html>
