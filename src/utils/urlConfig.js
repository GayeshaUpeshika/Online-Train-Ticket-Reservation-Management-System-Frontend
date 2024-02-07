// Define a function `urlConfig` that returns an object structure for URL configurations
const urlConfig = () => {
  return {
    // Base URL for API calls
    BaseURL: "http://localhost:5277/api/",

    // Define API methods grouped by their associated entities or functionalities
    methods: {
      // User-related endpoints
      User: {
        login: "User/login", // Endpoint for user login
        get:"User",
        register: "User/register", // Endpoint for user registration
      },

      // Product-related endpoints
      product: {
        getProductBySlug: "Product/getProductBySlug", // Endpoint to get a product by its slug
      },

      // Traveler-related endpoints
      Traveler: {
        register: "Traveler/register", // Endpoint for traveler registration
        get: "Traveler", // Endpoint to get traveler(s)
      },

      // Ticket-related endpoints
      Ticket: {
        get: "Ticket", // Endpoint to get ticket(s)
      },

      // Train-related endpoints
      Train: {
        get: "Train", // Endpoint to get train(s)
      },
    },
  };
};

// Export the `urlConfig` function to be used in other parts of the application
export default urlConfig;
