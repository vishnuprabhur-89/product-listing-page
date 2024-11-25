document.addEventListener("DOMContentLoaded", function () {
  // Variables for menu toggle
  const toggleButton = document.querySelector('.menu-toggle');
  const navigationLinks = document.querySelector('.nav-links');

  toggleButton.addEventListener('click', () => {
    navigationLinks.classList.toggle('show');
  });

  // Shop Now button redirection
  const shopNowButton = document.getElementById("shopNowBtn");
  if (shopNowButton) {
    shopNowButton.addEventListener("click", function () {
      window.location.href = "../pages/shop.html";
    });
  }

  const searchInput = document.getElementById("productSearch");

  // Search functionality
  searchInput?.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();

    const filteredItems = productList.filter((product) => {
      return product.title.toLowerCase().includes(query);
    });

    productContainer.innerHTML = "";
    displayFilteredItems(filteredItems);
  });

  const productContainer = document.querySelector(".products-container");
  let productList = [];
  let categoryList = [];
  let currentProductIndex = 0;
  let totalProductCount = 0;

  // Loading overlay
  const loadingScreen = document.querySelector(".loading-overlay");

  // Show loading screen initially
  loadingScreen.style.display = "block";

  // Fetch products from API
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      loadingScreen.style.display = "none";
      productList = data;
      totalProductCount = productList.length;

      // Populate initial 10 products
      loadProducts(currentProductIndex, 10);
      currentProductIndex += 10;

      updateProductCount();
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      loadingScreen.style.display = "none";
    });

  // Fetch categories from API
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((data) => {
      categoryList = data;
      renderCategories(data);
    })
    .catch((err) => console.error("Error fetching categories:", err));

  // Create category elements
  function generateCategoryElement(category) {
    const container = document.createElement("div");
    container.classList.add("category-item");

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.id = `category-${category}`;
    checkboxInput.value = category;
    checkboxInput.addEventListener("change", filterProductsByCategory);

    const label = document.createElement("label");
    label.textContent = capitalizeFirstLetter(category);
    label.setAttribute("for", `category-${category}`);

    container.appendChild(checkboxInput);
    container.appendChild(label);

    return container;
  }

  // Capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Render categories into the DOM
  function renderCategories(categories) {
    const filterContainer = document.querySelector(".filterCat");
    const categoryWrapper = document.createElement("div");
    categoryWrapper.classList.add("categories-list");

    categories.forEach((category) => {
      const categoryElement = generateCategoryElement(category);
      categoryWrapper.appendChild(categoryElement);
    });

    filterContainer.appendChild(categoryWrapper);
  }

  // Display products
  function loadProducts(start, limit) {
    const productsToDisplay = productList.slice(start, start + limit);

    productsToDisplay.forEach((item) => {
      const productItem = document.createElement("div");
      productItem.classList.add("productList");

      productItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>$${item.price}</p>
      `;

      productContainer.appendChild(productItem);
    });

    updateProductCount();
    toggleLoadMoreButton();
  }

  // Filter products by selected categories
  function filterProductsByCategory() {
    loadingScreen.style.display = "block";

    const selectedCategories = Array.from(
      document.querySelectorAll(".category-item input:checked")
    ).map((checkbox) => checkbox.value);

    setTimeout(() => {
      if (selectedCategories.length === 0) {
        productContainer.innerHTML = "";
        loadProducts(0, currentProductIndex);
      } else {
        const filteredItems = productList.filter((item) => {
          return selectedCategories.includes(item.category);
        });

        productContainer.innerHTML = "";
        displayFilteredItems(filteredItems);
      }
      loadingScreen.style.display = "none";
    }, 500);
  }

  // Display filtered products
  function displayFilteredItems(filteredItems) {
    filteredItems.forEach((item) => {
      const productItem = document.createElement("div");
      productItem.classList.add("productList");

      productItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>$${item.price}</p>
      `;

      productContainer.appendChild(productItem);
    });

    updateProductCount();
  }

  // Price range sliders
  const minSlider = document.getElementById("minPrice");
  const maxSlider = document.getElementById("maxPrice");
  const minPriceText = document.getElementById("minPriceValue");
  const maxPriceText = document.getElementById("maxPriceValue");

  // Reset price range filter
  function resetPriceFilter() {
    minSlider.value = 0;
    maxSlider.value = 1000;
    minPriceText.textContent = "0";
    maxPriceText.textContent = "1000";
    filterByPrice(0, 1000);
  }

  resetPriceFilter();

  // Event listeners for price sliders
  minSlider.addEventListener("input", updatePriceFilter);
  maxSlider.addEventListener("input", updatePriceFilter);

  function updatePriceFilter() {
    const minValue = parseInt(minSlider.value);
    const maxValue = parseInt(maxSlider.value);

    if (minValue > maxValue - 50) {
      if (event.target.id === "minPrice") {
        minSlider.value = maxValue - 50;
      } else {
        maxSlider.value = minValue + 50;
      }
    }

    minPriceText.textContent = minSlider.value;
    maxPriceText.textContent = maxSlider.value;

    filterByPrice(minSlider.value, maxSlider.value);
  }

  function filterByPrice(min, max) {
    loadingScreen.style.display = "block";

    setTimeout(() => {
      const filteredItems = productList.filter((item) => {
        return item.price >= min && item.price <= max;
      });

      productContainer.innerHTML = "";
      displayFilteredItems(filteredItems);

      loadingScreen.style.display = "none";
    }, 500);
  }

  // Update product count in the UI
  function updateProductCount() {
    const productCountElement = document.getElementById("totalProductCount");
    if (productCountElement) {
      const displayedProducts = productContainer.querySelectorAll(".productList").length;
      productCountElement.textContent = `${displayedProducts} Results`;
    }
  }

  // Load more button
  const loadMoreButton = document.querySelector(".load-more button");
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      loadingScreen.style.display = "block";
      const remaining = totalProductCount - currentProductIndex;
      const nextBatch = Math.min(remaining, 10);

      setTimeout(() => {
        loadProducts(currentProductIndex, nextBatch);
        currentProductIndex += nextBatch;
        toggleLoadMoreButton();
        loadingScreen.style.display = "none";
      }, 500);
    });
  }

  // Toggle visibility of Load More button
  function toggleLoadMoreButton() {
    if (currentProductIndex >= totalProductCount) {
      loadMoreButton.style.display = "none";
    }
  }

  // Sort functionality
  const sortSelect = document.querySelector(".sortOptions select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortCriteria = this.value;
      sortItems(sortCriteria);
    });
  }

  // Sort products
  function sortItems(criteria) {
    if (criteria === "Price -- Low to High") {
      productList.sort((a, b) => a.price - b.price);
    } else if (criteria === "Price -- High to Low") {
      productList.sort((a, b) => b.price - a.price);
    } else if (criteria === "Ratings") {
      productList.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    productContainer.innerHTML = "";
    loadProducts(0, currentProductIndex);
  }
});
