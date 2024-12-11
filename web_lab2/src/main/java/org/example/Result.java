package org.example;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Result {
    private float x;
    private double y;
    private double r;
    private boolean isHit;
    private String currentTime;
    private long executionTime;

    public Result(float x, double y, double r, boolean isHit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.currentTime = new SimpleDateFormat("HH:mm:ss").format(new Date());
        this.executionTime = System.nanoTime();
    }

    // Геттеры и сеттеры
    public float getX() {
        return x;
    }
    public double getY() {
        return y;
    }
    public double getR() {
        return r;
    }
    public boolean isHit() {
        return isHit;
    }
    public String getCurrentTime() {
        return currentTime;
    }
    public long getExecutionTime() {
        return executionTime;
    }
}

