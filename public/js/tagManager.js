const modal = document.querySelector('#tagModal');
const tagOptionsList = document.querySelector('.tag-options');
const tagOptions = document.querySelectorAll('.tag-options__item');
const tagList = document.querySelector('.tag-list');
const addTagBtn = document.querySelector('.tag-add-btn');
const fallbackMessage = document.querySelector('.modal__fallback-message');
const selectedTagsInput = document.querySelector('#selectedTagsInput');

let selectedTags = [];

function toggleModal() {
  if (modal.open) {
    modal.close();
  } else {
    updateAvailableTags();
    modal.showModal();
  }
}

function createTagElement(id, name) {
  const tagItem = document.createElement('li');

  const tag = document.createElement('button');
  tag.type = 'button';
  tag.classList.add('tag', 'tag--xs');
  tag.dataset.id = id;
  tag.setAttribute('aria-label', `Remove tag: ${name}`);

  const tagText = document.createElement('span');
  tagText.className = 'tag__text';
  tagText.textContent = name;

  const tagIcon = document.createElement('i');
  tagIcon.className = 'bx bx-x tag__icon';
  tagIcon.setAttribute('aria-hidden', 'true');

  tag.appendChild(tagText);
  tag.appendChild(tagIcon);
  tagItem.appendChild(tag);

  tag.addEventListener('click', () => removeTag(id));

  return tagItem;
}

function removeTag(id) {
  selectedTags = selectedTags.filter((tag) => tag.id !== id);
  updateTagList();
  updateSelectedTagsInput();
}

function addTag(id, name) {
  if (!selectedTags.some((tag) => tag.id === id)) {
    selectedTags.push({ id, name });
    updateTagList();
    updateSelectedTagsInput();
  }
}

// Update the hidden form input with selected tags
function updateSelectedTagsInput() {
  selectedTagsInput.value = JSON.stringify(selectedTags);
}

// Update the available tags list based on selected tags
function updateAvailableTags() {
  let availableCount = 0;

  tagOptions.forEach((option) => {
    const isSelected = selectedTags.some((tag) => tag.id === option.dataset.id);
    option.style.display = isSelected ? 'none' : '';

    if (!isSelected) {
      availableCount++;
    }
  });

  fallbackMessage.style.display = availableCount === 0 ? 'block' : 'none';
  tagOptionsList.style.display = availableCount === 0 ? 'none' : 'flex';
}

function updateTagList() {
  tagList.innerHTML = '';

  selectedTags.forEach((tag) => {
    const tagElement = createTagElement(tag.id, tag.name);
    tagList.appendChild(tagElement);
  });
}

addTagBtn.addEventListener('click', (e) => {
  e.preventDefault();
  toggleModal();
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.close();
  }
});

// Tag selection handlers
tagOptions.forEach((option) => {
  const selectTag = () => {
    const { id, name } = option.dataset;
    addTag(id, name);
    modal.close();
  };

  option.addEventListener('click', selectTag);

  option.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectTag();
    }
  });
});

// Initialize
updateTagList();
updateSelectedTagsInput();
