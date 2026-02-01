#!/usr/bin/env python3
"""
Скрипт для переименования файлов с кириллическими именами в латинские.
Использует нечеткий поиск по подстроке.

Запуск: python rename_assets.py
"""

import os
from pathlib import Path

ASSETS_DIR = Path("client/public/attached_assets")

RENAME_MAP = [
    (["Внешний вид", "Экстерьер1"], "exterior-01.jpg"),
    (["Экстерьер2"], "exterior-02.jpg"),
    (["Экстерьер3"], "exterior-03.jpg"),
    (["Экстерьер4"], "exterior-04.jpg"),
    (["экстерьер5"], "exterior-05.jpg"),
    (["Экстерьер 6", "Экстерьер6"], "exterior-06.jpg"),
    (["Интерьер1"], "interior-01.jpg"),
    (["Интерьер2"], "interior-02.jpg"),
    (["Интерьер3"], "interior-03.jpg"),
    (["Интерьер4"], "interior-04.jpg"),
    (["Лого"], "logo-kaltan.png"),
    (["Политика"], "privacy-policy.txt"),
    (["Пользовательское"], "user-agreement.txt"),
]

def find_file_by_pattern(directory: Path, patterns: list[str], target_ext: str) -> Path | None:
    """Ищет файл, содержащий любой из паттернов в имени."""
    if not directory.exists():
        return None
    
    for file in directory.iterdir():
        if not file.is_file():
            continue
        filename = file.name
        for pattern in patterns:
            if pattern.lower() in filename.lower():
                if target_ext == ".png" and not filename.lower().endswith(".png"):
                    continue
                if target_ext == ".txt" and not filename.lower().endswith(".txt"):
                    continue
                return file
    return None

def main():
    if not ASSETS_DIR.exists():
        print(f"Папка не найдена: {ASSETS_DIR}")
        print("Проверьте путь к папке с файлами.")
        return

    print(f"Поиск файлов в: {ASSETS_DIR.absolute()}")
    print("-" * 50)
    
    renamed_count = 0
    not_found_count = 0
    
    for patterns, new_name in RENAME_MAP:
        target_ext = Path(new_name).suffix
        found_file = find_file_by_pattern(ASSETS_DIR, patterns, target_ext)
        
        if found_file:
            new_path = ASSETS_DIR / new_name
            if found_file.name == new_name:
                print(f"Уже переименован: {new_name}")
            elif new_path.exists():
                print(f"Целевой файл уже существует: {new_name}")
            else:
                found_file.rename(new_path)
                print(f"Renamed: {found_file.name} -> {new_name}")
                renamed_count += 1
        else:
            print(f"File not found for: {patterns[0]} -> {new_name}")
            not_found_count += 1
    
    print("-" * 50)
    print(f"Переименовано: {renamed_count}")
    print(f"Не найдено: {not_found_count}")

if __name__ == "__main__":
    main()
