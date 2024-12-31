// Modal elements
const editModal = document.getElementById('edit-category-modal');
const createModal = document.getElementById('create-category-modal');
const deleteModal = document.getElementById('delete-category-modal');
const editModalOverlay = document.getElementById('edit-modal-overlay');
const createModalOverlay = document.getElementById('create-modal-overlay');
const deleteModalOverlay = document.getElementById('delete-modal-overlay');
const editForm = document.getElementById('edit-category-form');
const createCategoryForm = document.getElementById('create-category-form');

let categoryIdToDelete = null; // Variable to hold category id to delete

// Show modal for editing category
document.querySelectorAll('.category-table tbody tr').forEach(row => {
    row.addEventListener('click', (e) => {
        // Check if the clicked element is the delete button
        if (e.target.classList.contains('delete-btn')) {
            return; // If it's the delete button, don't trigger row click
        }

        const id = row.dataset.id;
        const name = row.dataset.name;
        const description = row.dataset.description;

        // Fill modal inputs
        document.getElementById('category-id').value = id;
        document.getElementById('category-name').value = name;
        document.getElementById('category-description').value = description;

        // Show edit modal
        editModal.classList.add('show');
        editModalOverlay.classList.add('show');
    });
});

// Show modal for creating a new category
document.getElementById('create-category-btn').addEventListener('click', () => {
    document.querySelector('.modal h2').innerText = 'Tạo danh mục mới';
    createCategoryForm.reset();

    // Show create modal
    createModal.classList.add('show');
    createModalOverlay.classList.add('show');
});

// Show modal for deleting a category
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        categoryIdToDelete = e.target.dataset.id; // Get the category ID from the button
        // Show delete confirmation modal
        deleteModal.classList.add('show');
        deleteModalOverlay.classList.add('show');
        e.stopPropagation(); // Prevent the row click event from triggering
    });
});

// Hide modals
editModalOverlay.addEventListener('click', () => {
    editModal.classList.remove('show');
    editModalOverlay.classList.remove('show');
});

createModalOverlay.addEventListener('click', () => {
    createModal.classList.remove('show');
    createModalOverlay.classList.remove('show');
});

deleteModalOverlay.addEventListener('click', () => {
    deleteModal.classList.remove('show');
    deleteModalOverlay.classList.remove('show');
});

// Update category logic
document.getElementById('update-category-btn').addEventListener('click', () => {
    const formData = new FormData(editForm);

    // Replace this with an actual update API call
    console.log('Updating category:', {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description')
    });

    // Hide modal
    editModal.classList.remove('show');
    editModalOverlay.classList.remove('show');
});

// Save new category logic
document.getElementById('save-category-btn').addEventListener('click', () => {
    const formData = new FormData(createCategoryForm);

    // Replace this with an actual API call
    console.log('Creating new category:', {
        name: formData.get('name'),
        description: formData.get('description')
    });

    // Hide modal
    createModal.classList.remove('show');
    createModalOverlay.classList.remove('show');
});

// Delete category logic
document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    // When confirmed, send the category id to be deleted
    console.log('Deleting category with ID:', categoryIdToDelete);

    // Hide delete modal
    deleteModal.classList.remove('show');
    deleteModalOverlay.classList.remove('show');

    // Perform actual deletion logic (e.g., API call) here
});

document.getElementById('cancel-delete-btn').addEventListener('click', () => {
    // Hide delete modal
    deleteModal.classList.remove('show');
    deleteModalOverlay.classList.remove('show');
});


var loading = document.querySelector('.loading');
loading.style.display = "none";


