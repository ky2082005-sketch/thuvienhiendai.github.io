// Modern Library Management System with IndexedDB

class LibraryManager {
    constructor() {
        this.books = [];
        this.currentEditId = null;
        this.currentView = 'grid';
        this.dbName = 'LibraryDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDB();
    }

    // Khởi tạo IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Lỗi mở database');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database đã sẵn sàng');
                this.loadBooks().then(() => {
                    this.init();
                    resolve();
                });
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Tạo object store cho sách
                if (!db.objectStoreNames.contains('books')) {
                    const objectStore = db.createObjectStore('books', { keyPath: 'id' });
                    objectStore.createIndex('title', 'title', { unique: false });
                    objectStore.createIndex('category', 'category', { unique: false });
                }
                
                console.log('Database được tạo/nâng cấp');
            };
        });
    }

    init() {
        this.renderBooks();
        this.attachEventListeners();
        this.updateStats();
    }

    // Load books từ IndexedDB
    async loadBooks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['books'], 'readonly');
            const objectStore = transaction.objectStore('books');
            const request = objectStore.getAll();

            request.onsuccess = () => {
                this.books = request.result;
                
                // Nếu chưa có sách, thêm dữ liệu mẫu
                if (this.books.length === 0) {
                    this.addDefaultBooks().then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            };

            request.onerror = () => {
                console.error('Lỗi load sách');
                reject(request.error);
            };
        });
    }

    // Thêm sách mặc định
    async addDefaultBooks() {
        const defaultBooks = [
            {
                id: Date.now() + 1,
                title: 'Đắc Nhân Tâm',
                author: 'Dale Carnegie',
                category: 'Kỹ năng',
                year: 1936,
                status: 'Còn',
                image: 'assets/images/dac-nhan-tam.jpg'
            },
            {
                id: Date.now() + 2,
                title: 'Sapiens: Lược Sử Loài Người',
                author: 'Yuval Noah Harari',
                category: 'Lịch sử',
                year: 2011,
                status: 'Còn',
                image: 'assets/images/sapiens-yuval-noah-harari.jpg'
            },
            {
                id: Date.now() + 3,
                title: 'Nhà Giả Kim',
                author: 'Paulo Coelho',
                category: 'Văn học',
                year: 1988,
                status: 'Còn',
                image: 'assets/images/nha-gia-kim-paulo-coelho.jpg'
            },
            {
                id: Date.now() + 4,
                title: 'Tư Duy Nhanh Và Chậm',
                author: 'Daniel Kahneman',
                category: 'Khoa học',
                year: 2011,
                status: 'Còn',
                image: 'assets/images/tu-duy-nhanh-va-cham-daniel-kahneman.jpg'
            },
            {
                id: Date.now() + 5,
                title: 'Cha Giàu Cha Nghèo',
                author: 'Robert Kiyosaki',
                category: 'Kinh tế',
                year: 1997,
                status: 'Còn',
                image: 'assets/images/cha-giau-cha-ngheo.jpg'
            },
            {
                id: Date.now() + 6,
                title: 'Thói Quen Nguyên Tử',
                author: 'James Clear',
                category: 'Kỹ năng',
                year: 2018,
                status: 'Còn',
                image: 'assets/images/thoi-quen-nguyen-tu-james-clear.jpg'
            },
            {
                id: Date.now() + 7,
                title: 'Binh Pháp Tôn Tử',
                author: 'Tôn Tử',
                category: 'Lịch sử',
                year: -500,
                status: 'Còn',
                image: 'assets/images/binh-phap-ton-tu-sun-tzu.jpg'
            },
            {
                id: Date.now() + 8,
                title: 'Clean Code',
                author: 'Robert C. Martin',
                category: 'Công nghệ',
                year: 2008,
                status: 'Còn',
                image: 'assets/images/clean-code-robert-c-martin.jpg'
            },
            {
                id: Date.now() + 9,
                title: 'Hoàng Tử Bé',
                author: 'Antoine de Saint-Exupéry',
                category: 'Thiếu nhi',
                year: 1943,
                status: 'Còn',
                image: 'assets/images/hoang-tu-be-antoine-de-saint-exupery.jpg'
            },
            {
                id: Date.now() + 10,
                title: 'Zero to One',
                author: 'Peter Thiel',
                category: 'Kinh tế',
                year: 2014,
                status: 'Còn',
                image: 'assets/images/zero-to-one-peter-thiel.jpg'
            },
            {
                id: Date.now() + 11,
                title: 'Nghệ Thuật Bán Hàng',
                author: 'Zig Ziglar',
                category: 'Kỹ năng',
                year: 1982,
                status: 'Còn',
                image: 'assets/images/nghe-thuat-ban-hang.jpg'
            },
            {
                id: Date.now() + 12,
                title: 'Đừng Bao Giờ Đi Ăn Một Mình',
                author: 'Keith Ferrazzi',
                category: 'Kỹ năng',
                year: 2005,
                status: 'Còn',
                image: 'assets/images/dung-bao-gio-di-an-mot-minh.jpg'
            },
            {
                id: Date.now() + 13,
                title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
                author: 'Rosie Nguyễn',
                category: 'Văn học',
                year: 2018,
                status: 'Còn',
                image: 'assets/images/tuoi-tre-dang-gia-bao-nhieu.jpg'
            },
            {
                id: Date.now() + 14,
                title: 'Càng Bình Tĩnh Càng Hạnh Phúc',
                author: 'Nguyễn Anh Dũng',
                category: 'Văn học',
                year: 2019,
                status: 'Hết',
                image: 'assets/images/cang-binh-tinh-cang-hanh-phuc.jpg'
            },
            {
                id: Date.now() + 15,
                title: 'Hành Trình Về Phương Đông',
                author: 'Nguyễn Phong',
                category: 'Văn học',
                year: 2005,
                status: 'Còn',
                image: 'assets/images/hanh-trinh-ve-phuong-dong.jpg'
            },
            {
                id: Date.now() + 16,
                title: 'Lược Sử Thời Gian',
                author: 'Stephen Hawking',
                category: 'Khoa học',
                year: 1988,
                status: 'Còn',
                image: 'assets/images/luoc-su-thoi-gian.jpg'
            },
            {
                id: Date.now() + 17,
                title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
                author: 'Stephen Hawking',
                category: 'Khoa học',
                year: 2001,
                status: 'Còn',
                image: 'assets/images/vu-tru-trong-vo-hat-de.jpg'
            },
            {
                id: Date.now() + 18,
                title: 'Trí Tuệ Nhân Tạo',
                author: 'Kai-Fu Lee',
                category: 'Công nghệ',
                year: 2018,
                status: 'Còn',
                image: 'assets/images/tri-tue-nhan-tao.jpg'
            },
            {
                id: Date.now() + 19,
                title: 'The Lean Startup',
                author: 'Eric Ries',
                category: 'Kinh tế',
                year: 2011,
                status: 'Còn',
                image: 'assets/images/the-lean-startup.jpg'
            },
            {
                id: Date.now() + 20,
                title: 'Chiến Tranh Tiền Tệ',
                author: 'Song Hong Bing',
                category: 'Kinh tế',
                year: 2007,
                status: 'Hết',
                image: 'assets/images/chien-tranh-tien-te.jpg'
            },
            {
                id: Date.now() + 21,
                title: 'Lịch Sử Việt Nam',
                author: 'Nhiều tác giả',
                category: 'Lịch sử',
                year: 2015,
                status: 'Còn',
                image: 'assets/images/lich-su-viet-nam.jpg'
            },
            {
                id: Date.now() + 22,
                title: 'Đại Việt Sử Ký Toàn Thư',
                author: 'Ngô Sĩ Liên',
                category: 'Lịch sử',
                year: 1479,
                status: 'Còn',
                image: 'assets/images/dai-viet-su-ky-toan-thu.jpg'
            },
            {
                id: Date.now() + 23,
                title: 'Harry Potter và Hòn Đá Phù Thủy',
                author: 'J.K. Rowling',
                category: 'Thiếu nhi',
                year: 1997,
                status: 'Còn',
                image: 'assets/images/harry-potter-va-hon-da-phu-thuy.jpg'
            },
            {
                id: Date.now() + 24,
                title: 'Dế Mèn Phiêu Lưu Ký',
                author: 'Tô Hoài',
                category: 'Thiếu nhi',
                year: 1941,
                status: 'Còn',
                image: 'assets/images/de-men-phieu-luu-ky.jpg'
            },
            {
                id: Date.now() + 25,
                title: 'Doraemon - Chú Mèo Máy Đến Từ Tương Lai',
                author: 'Fujiko F. Fujio',
                category: 'Thiếu nhi',
                year: 1969,
                status: 'Còn',
                image: 'assets/images/doraemon-chu-meo-may-den-tu-tuong-lai.jpg'
            },
            {
                id: Date.now() + 26,
                title: 'Lập Trình Python Cơ Bản',
                author: 'Nguyễn Văn A',
                category: 'Công nghệ',
                year: 2020,
                status: 'Còn',
                image: 'assets/images/lap-trinh-python-co-ban.jpg'
            },
            {
                id: Date.now() + 27,
                title: 'JavaScript: The Good Parts',
                author: 'Douglas Crockford',
                category: 'Công nghệ',
                year: 2008,
                status: 'Sắp có',
                image: 'assets/images/javascript.jpg'
            }
        ];

        for (const book of defaultBooks) {
            await this.saveBook(book);
        }
        
        await this.loadBooks();
    }

    // Lưu sách vào IndexedDB
    async saveBook(book) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['books'], 'readwrite');
            const objectStore = transaction.objectStore('books');
            const request = objectStore.put(book);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                console.error('Lỗi lưu sách:', request.error);
                reject(request.error);
            };
        });
    }

    // Xóa sách khỏi IndexedDB
    async deleteBookFromDB(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['books'], 'readwrite');
            const objectStore = transaction.objectStore('books');
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                console.error('Lỗi xóa sách');
                reject(request.error);
            };
        });
    }

    // Update statistics
    updateStats() {
        const totalBooks = this.books.length;
        const categories = new Set(this.books.map(book => book.category)).size;
        const positiveYears = this.books
            .map(book => book.year)
            .filter(year => year > 0);

        const newestYear = positiveYears.length > 0 
            ? Math.max(...positiveYears) 
            : 'N/A';

        document.getElementById('totalBooks').textContent = totalBooks;
        document.getElementById('totalCategories').textContent = categories;
        document.getElementById('newestYear').textContent = newestYear > 0 ? newestYear : 'N/A';
    }

    // Render all books
    renderBooks(booksToRender = this.books) {
        const grid = document.getElementById('booksGrid');
        
        if (booksToRender.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <div class="empty-state-text">Không tìm thấy sách nào</div>
                    <p>Thêm sách mới để bắt đầu xây dựng thư viện của bạn</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = booksToRender.map(book => `
            <div class="book-card" data-id="${book.id}" onclick="libraryManager.showDetail(${book.id})">
                <div class="book-image">
                    ${book.image ? `<img src="${book.image}" alt="${this.escapeHtml(book.title)}" loading="lazy">` : '📖'}
                </div>
                <div class="book-info">
                    <div class="book-title">${this.escapeHtml(book.title)}</div>
                    <div class="book-author">✍️ ${this.escapeHtml(book.author)}</div>
                    <div class="book-details">
                        <span class="book-category">${this.escapeHtml(book.category)}</span>
                        <span class="book-year">📅 ${this.formatYear(book.year)}</span>
                    </div>
                    <div class="book-actions">
                        <button class="btn-edit" onclick="event.stopPropagation(); libraryManager.editBook(${book.id})">
                            ✏️ Sửa
                        </button>
                        <button class="btn-delete" onclick="event.stopPropagation(); libraryManager.deleteBook(${book.id})">
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add new book
    async addBook(bookData) {
        const newBook = {
            id: Date.now(),
            ...bookData
        };
        
        await this.saveBook(newBook);
        await this.loadBooks();
        this.renderBooks();
        this.updateStats();
        this.showNotification('✅ Thêm sách thành công!', 'success');
    }

    // Edit book
    editBook(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        this.currentEditId = id;
        
        // Populate form
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookAuthor').value = book.author;
        document.getElementById('editBookCategory').value = book.category;
        document.getElementById('editBookYear').value = book.year;
        document.getElementById('editBookStatus').value = book.status;
        
        // Show current image
        const preview = document.getElementById('editImagePreview');
        if (book.image) {
            preview.innerHTML = `<img src="${book.image}" alt="Current image">`;
        } else {
            preview.innerHTML = '';
        }

        // Show modal
        document.getElementById('editModal').classList.add('active');
    }

    // Update book
    async updateBook(id, bookData) {
        const bookToUpdate = {
            id: id,
            ...bookData
        };
        
        await this.saveBook(bookToUpdate);
        await this.loadBooks();
        this.renderBooks();
        this.updateStats();
        this.showNotification('✅ Cập nhật sách thành công!', 'success');
    }

    // Delete book
    async deleteBook(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
            await this.deleteBookFromDB(id);
            await this.loadBooks();
            this.renderBooks();
            this.updateStats();
            this.showNotification('✅ Đã xóa sách thành công!', 'success');
        }
    }

    // Search books
    searchBooks(query) {
        const lowerQuery = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter by category
    filterByCategory(category) {
        if (!category) return this.books;
        return this.books.filter(book => book.category === category);
    }

    // Combined search and filter
    applyFilters() {
        const searchQuery = document.getElementById('searchInput').value;
        const category = document.getElementById('categoryFilter').value;

        let filtered = this.books;

        if (searchQuery) {
            filtered = this.searchBooks(searchQuery);
        }

        if (category) {
            filtered = filtered.filter(book => book.category === category);
        }

        this.renderBooks(filtered);
    }

    // Toggle view
    toggleView(view) {
        this.currentView = view;
        const grid = document.getElementById('booksGrid');
        const buttons = document.querySelectorAll('.view-btn');
        
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    // Handle image upload with compression
    handleImageUpload(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            // Kiểm tra kích thước file (giới hạn 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('⚠️ File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB');
                resolve(null);
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Nén ảnh
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Resize nếu ảnh quá lớn
                    const maxWidth = 800;
                    const maxHeight = 1200;
                    
                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64 với chất lượng 0.7
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
                
                img.onerror = reject;
                img.src = e.target.result;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        alert(message);
    }

    // Attach event listeners
    attachEventListeners() {
        // Show add form
        document.getElementById('btnShowAddForm').addEventListener('click', () => {
            document.getElementById('addFormContainer').classList.add('active');
            document.getElementById('addBookForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('addFormContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Cancel add form
        document.getElementById('btnCancelAdd').addEventListener('click', () => {
            document.getElementById('addFormContainer').classList.remove('active');
        });

        document.getElementById('btnCancelAddBottom').addEventListener('click', () => {
            document.getElementById('addFormContainer').classList.remove('active');
        });

        // Add book form submit
        document.getElementById('addBookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const imageFile = document.getElementById('bookImage').files[0];
            const imageData = await this.handleImageUpload(imageFile);

            const bookData = {
                title: document.getElementById('bookTitle').value,
                author: document.getElementById('bookAuthor').value,
                category: document.getElementById('bookCategory').value,
                year: parseInt(document.getElementById('bookYear').value),
                status: document.getElementById('bookStatus').value,
                image: imageData || ''
            };

            await this.addBook(bookData);
            document.getElementById('addFormContainer').classList.remove('active');
        });

        // Image preview for add form
        document.getElementById('bookImage').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const imageData = await this.handleImageUpload(file);
                if (imageData) {
                    document.getElementById('imagePreview').innerHTML = `<img src="${imageData}" alt="Preview">`;
                }
            }
        });

        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('editModal').classList.remove('active');
        });

        // Cancel edit
        document.getElementById('btnCancelEdit').addEventListener('click', () => {
            document.getElementById('editModal').classList.remove('active');
        });

        // Edit book form submit
        document.getElementById('editBookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('editBookId').value);
            const imageFile = document.getElementById('editBookImage').files[0];
            
            let imageData;
            if (imageFile) {
                imageData = await this.handleImageUpload(imageFile);
            } else {
                const book = this.books.find(b => b.id === id);
                imageData = book ? book.image : '';
            }

            const bookData = {
                title: document.getElementById('editBookTitle').value,
                author: document.getElementById('editBookAuthor').value,
                category: document.getElementById('editBookCategory').value,
                year: parseInt(document.getElementById('editBookYear').value),
                status: document.getElementById('editBookStatus').value,
                image: imageData || ''
            };

            await this.updateBook(id, bookData);
            document.getElementById('editModal').classList.remove('active');
        });

        // Image preview for edit form
        document.getElementById('editBookImage').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const imageData = await this.handleImageUpload(file);
                if (imageData) {
                    document.getElementById('editImagePreview').innerHTML = `<img src="${imageData}" alt="Preview">`;
                }
            }
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', () => {
            this.applyFilters();
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleView(btn.dataset.view);
            });
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                document.getElementById('editModal').classList.remove('active');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('editModal').classList.remove('active');
                document.getElementById('addFormContainer').classList.remove('active');
                document.getElementById('detailModal').classList.remove('active');
            }
        });
    }

    formatYear(year) {
        if (year < 0) {
            return `${Math.abs(year)} TCN`;
        }
        return year;
    }

    showDetail(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        document.getElementById("detailImage").src = book.image || '';
        document.getElementById("detailTitle").textContent = book.title;
        document.getElementById("detailAuthor").textContent = book.author;
        document.getElementById("detailCategory").textContent = book.category;
        document.getElementById("detailYear").textContent = this.formatYear(book.year);
        document.getElementById("detailQuantity").textContent = book.quantity ?? "—";
        document.getElementById("detailStatus").textContent = book.status ?? "—";

        document.getElementById("btnEditFromDetail").onclick = () => {
            this.editBook(id);
            document.getElementById("detailModal").classList.remove("active");
        };
        
        document.getElementById("btnReadBook").onclick = () => {
            const contentBox = document.getElementById("bookReadingArea");
            const contentText = document.getElementById("readingContent");

            if (book.content && book.content.trim() !== "") {
                contentText.innerHTML = book.content.replace(/\n/g, "<br>");
            } else {
                contentText.innerHTML = "<i>Chưa có nội dung cho sách này.</i>";
            }

            contentBox.style.display = "block";
        };

        document.getElementById("detailModal").classList.add("active");
    }
}

document.getElementById("closeDetailModal").onclick = () => {
    document.getElementById("detailModal").classList.remove("active");
};

document.getElementById("detailModal").addEventListener("click", (e) => {
    if (e.target.id === "detailModal") {
        e.target.classList.remove("active");
    }
});

// Initialize the library manager
const libraryManager = new LibraryManager();
window.libraryManager = libraryManager;


document.documentElement.style.scrollBehavior = 'smooth';

