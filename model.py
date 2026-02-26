# EcoCampus AI - 数据模型层（能耗预测）
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def _build_dataset(n_samples=500, seed=42):
    """生成虚拟能耗数据集。"""
    rng = np.random.default_rng(seed)
    hour = rng.integers(0, 25, size=n_samples)
    temp = rng.uniform(-5, 35, size=n_samples)
    is_holiday = rng.integers(0, 2, size=n_samples)
    # 简单线性关系 + 噪声：夜间/节假日倾向更高基础能耗，温度影响制冷/采暖
    power = (
        100
        + 3 * hour
        + 2 * temp
        + 50 * is_holiday
        + rng.normal(0, 15, size=n_samples)
    )
    power = np.maximum(power, 20)
    return pd.DataFrame({
        "hour": hour,
        "temp": temp,
        "is_holiday": is_holiday,
        "power": power,
    })


class EnergyPredictor:
    """基于线性回归的能耗预测器。"""

    def __init__(self):
        df = _build_dataset()
        X = df[["hour", "temp", "is_holiday"]]
        y = df["power"]
        self._model = LinearRegression()
        self._model.fit(X, y)

    def predict(self, hour: float, temp: float, is_holiday: int) -> float:
        """
        预测给定条件下的能耗。
        :param hour: 时间 0-24
        :param temp: 室外温度（℃）
        :param is_holiday: 是否节假日 0 或 1
        :return: 预测能耗值
        """
        X = np.array([[hour, temp, is_holiday]])
        return float(self._model.predict(X)[0])
