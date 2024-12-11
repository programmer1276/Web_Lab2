package org.example;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/areaCheck")
public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Получаем массив значений X
        String[] xValues = request.getParameterValues("x");
        String yParam = request.getParameter("y");
        String rParam = request.getParameter("r");

        // Проверяем наличие параметров
        if (xValues == null || yParam == null || rParam == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Недостаточно параметров");
            return;
        }

        // Парсим Y и R
        double y;
        double r;
        try {
            y = Double.parseDouble(yParam);
            r = Double.parseDouble(rParam);
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Некорректные значения Y или R");
            return;
        }

        // Список новых результатов
        List<Result> newResults = new ArrayList<>();

        // Обрабатываем каждое значение X
        for (String xParam : xValues) {
            try {
                float x = Float.parseFloat(xParam);
                boolean isHit = checkHit(x, y, r);
                newResults.add(new Result(x, y, r, isHit));
            } catch (NumberFormatException e) {
                // Если значение X некорректное, пропускаем его
                continue;
            }
        }

        List<Result> appResults = (List<Result>) getServletContext().getAttribute("results");
        if (appResults == null) {
            appResults = new ArrayList<>();
        }

        appResults.addAll(newResults);
        getServletContext().setAttribute("results", appResults);

        // Возвращаем список результатов в формате JSON
        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(newResults));
    }

    private boolean checkHit(float x, double y, double r) {
        if ((x >= 0) && (y >= 0) && (y <= -2*x + r)) return true;
        if ((x <= 0) && (y >= 0) && (x >= -r) && (y <= r/2)) return true;
        if ((x >= -r) && (y >= -r) && (x <= 0) && (y <= 0) && (x*x + y*y <= r*r)) return true;
        return false;
    }
}