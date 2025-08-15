# RaleFinance

RaleFinance, kullanıcıların kişisel finanslarını yönetmelerine, harcamalarını takip etmelerine ve finansal hedefler belirlemelerine olanak tanıyan bir web uygulamasıdır. Bu proje, Angular ile geliştirilmiş bir ön yüz (frontend) ve Go ile oluşturulmuş bir REST API arka yüzünden (backend) oluşmaktadır.

## ⭐ Özellikler

  - **Kullanıcı Yönetimi:** Kayıt olma ve JWT tabanlı güvenli giriş işlemleri.
  - **Finansal Hedef Belirleme:** Kullanıcılar kendilerine özel finansal hedefler (örneğin, ev almak, araba almak) ve bu hedefler için birikim miktarı belirleyebilirler.
  - **Harcama ve Gelir Takibi:** Gelir ve gider işlemlerini kaydederek finansal durumu anlık olarak takip etme.
  - **Kategori Yönetimi:** Harcamaları kategorize etmek için kişisel kategoriler oluşturma, düzenleme ve silme. Her kategori için aylık bütçe limiti belirleme.
  - **İşlem Gruplama:** Yapılan işlemleri günlük, haftalık ve aylık olarak gruplandırarak görüntüleme.
  - **Bildirimler:** Belirlenen kategori bütçesi aşıldığında kullanıcıya bildirim gösterme.
  - **Finansal Eğitim:** Yatırım stratejileri, para biriktirme yöntemleri gibi konularda eğitici içerikler ve videolar.

## 🛠️ Teknolojiler

### Frontend (rale-finans)

  - **Framework**: Angular
  - **Dil**: TypeScript
  - **Stil**: Tailwind CSS & Angular Material
  - **Grafik Kütüphanesi**: Chart.js

### Backend (rest-api)

  - **Dil**: Go
  - **Framework**: Gin Gonic
  - **Veritabanı**: SQLite
  - **Kimlik Doğrulama**: JWT (JSON Web Tokens)

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1\. Backend (rest-api)

Backend sunucusunu çalıştırmak için:

1.  **Go Kurulumu:** Makinenizde Go'nun kurulu olduğundan emin olun.
2.  **Dizine Gidin:**
    ```bash
    cd rest-api
    ```
3.  **Gerekli Paketleri Yükleyin:**
    ```bash
    go mod tidy
    ```
4.  **Sunucuyu Başlatın:**
    ```bash
    go run main.go
    ```

Sunucu varsayılan olarak `http://localhost:8080` adresinde çalışacaktır.

### 2\. Frontend (rale-finans)

Frontend uygulamasını çalıştırmak için:

1.  **Node.js ve Angular CLI Kurulumu:** Makinenizde Node.js ve Angular CLI'ın kurulu olduğundan emin olun.
2.  **Dizine Gidin:**
    ```bash
    cd rale-finans
    ```
3.  **Gerekli Paketleri Yükleyin:**
    ```bash
    npm install
    ```
4.  **Uygulamayı Başlatın:**
    ```bash
    ng serve
    ```

Uygulama, `http://localhost:4200/` adresinde çalışmaya başlayacaktır.

## 📝 API Endpointleri

Projenin backend'i aşağıdaki REST API endpointlerini sunmaktadır:

| Method | Endpoint | Açıklama | Kimlik Doğrulama |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Yeni kullanıcı oluşturur. | Gerekmez |
| `POST` | `/login` | Kullanıcı girişi yapar ve JWT döndürür. | Gerekmez |
| `GET` | `/users/:id` | Belirtilen ID'ye sahip kullanıcıyı getirir. | Gerekir |
| `PUT` | `/users/:id` | Kullanıcının finansal hedeflerini günceller. | Gerekir |
| `GET` | `/categories` | Giriş yapmış kullanıcıya ait kategorileri listeler. | Gerekir |
| `POST`| `/categories`| Yeni bir kategori oluşturur. | Gerekir |
| `PUT` | `/categories/:id`| Belirtilen kategoriyi günceller. | Gerekir |
| `DELETE`| `/categories/:id`| Belirtilen kategoriyi siler. | Gerekir |
| `GET` | `/transactions`| Giriş yapmış kullanıcıya ait işlemleri listeler. | Gerekir |
| `POST`| `/transactions`| Yeni bir işlem oluşturur. | Gerekir |

## 📜 Kullanılabilir Komutlar (Frontend)

  - `ng serve`: Geliştirme sunucusunu başlatır.
  - `ng build`: Projeyi derler ve `dist/` dizinine atar.
  - `ng test`: Birim testlerini çalıştırır.
  - `ng e2e`: Uçtan uca testleri çalıştırır.
