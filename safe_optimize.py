import os
import shutil
from PIL import Image

source_folder = "client/public/attached_assets"
backup_folder = "client/public/attached_assets_BACKUP"
quality_val = 80
max_width = 1920

def safe_optimize():
    if not os.path.exists(source_folder):
        print(f"❌ Ошибка: Папка {source_folder} не найдена!")
        return

    print(f"📦 Создаю резервную копию в {backup_folder}...")
    if os.path.exists(backup_folder):
        print(f"⚠️ Папка бэкапа уже существует. Пропускаю создание копии (чтобы не затереть старый бэкап).")
    else:
        try:
            shutil.copytree(source_folder, backup_folder)
            print(f"✅ Резервная копия создана успешно!")
        except Exception as e:
            print(f"❌ Ошибка при создании бэкапа: {e}")
            print("⛔ ОСТАНОВКА: Скрипт остановлен во избежание потери данных.")
            return

    print("🚀 Начинаю оптимизацию изображений в основной папке...")
    count = 0
    saved_space = 0

    for filename in os.listdir(source_folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(source_folder, filename)
            
            try:
                old_size = os.path.getsize(filepath)
                
                with Image.open(filepath) as img:
                    if img.width > max_width:
                        ratio = max_width / float(img.width)
                        new_height = int(float(img.height) * ratio)
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    
                    if filename.lower().endswith('.png'):
                        img.save(filepath, optimize=True)
                    else:
                        if img.mode in ("RGBA", "P"): img = img.convert("RGB")
                        img.save(filepath, optimize=True, quality=quality_val)
                
                new_size = os.path.getsize(filepath)
                saved_space += (old_size - new_size)
                count += 1
                print(f"Ок: {filename}")
                
            except Exception as e:
                print(f"⚠️ Ошибка файла {filename}: {e}")

    print(f"\n🏁 Готово! Обработано: {count}. Сэкономлено: {saved_space / (1024*1024):.2f} MB")
    print(f"🛡️ Оригиналы сохранены в: {backup_folder}")

if __name__ == "__main__":
    safe_optimize()
