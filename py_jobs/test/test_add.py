"""This file contains tests for the Add class."""

from src.add import Add


def test_add():
    """Test the Add class."""
    add = Add(2, 3)
    assert add.calculate_sum() == 5


def test_add_negative():
    """Test the Add class with negative numbers."""
    add = Add(-2, -3)
    assert add.calculate_sum() == -5


def test_add_mixed():
    """Test the Add class with mixed numbers."""
    add = Add(-2, 3)
    assert add.calculate_sum() == 1


def test_add_zero():
    """Test the Add class with zero."""
    add = Add(0, 3)
    assert add.calculate_sum() == 3
