export interface Product {
    product_id: string;
    name: string;
    brand_id: string;
    category: string;
    description: string;
    price: number;
    date_added: string;
  }
  
  export interface Brand {
    brand_id: string;
    name: string;
    description: string;
    date_joined: string;
  }
  
  export interface User {
    user_id: string;
    name: string;
    username: string;
    email: string;
    date_joined: string;
  }
  
  export interface RatingMetrics {
    overall_rating: number;
    quality: number;
    value_for_money: number;
    ease_of_use: number;
    customer_service: number;
    features: number;
    performance: number;
    reliability: number;
    design: number;
    packaging: number;
  }
  
  export interface Review {
    review_id: string;
    product_id: string;
    reviewer_id: string;
    date: string;
    comments: string;
    rating_metrics: RatingMetrics;
  }
  
  export interface ProductReview {
    product: Product;
    brand: Brand;
    user: User;
    review: Review;
  }
  