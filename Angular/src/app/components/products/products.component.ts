import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/models/apiresponse.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  response: ApiResponse | null = null;
  products: Product[] = [];
  isLoggedIn: boolean = false;
  userId: string | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: ApiResponse) => {
      const response: ApiResponse = data;
      this.products = response.data;
    });

    // Check if user is logged in and get userId
    this.userId = localStorage.getItem('userId');
    this.isLoggedIn = !!this.userId;
  }

  viewProductDetail(productId: any): void {
    console.log(productId);
    this.router.navigate(['/product-detail', productId]);
  }

  addToCart(product: Product): void {
    if (this.isLoggedIn && this.userId) {
      // User is logged in, add product to cart in the database
      const cartItem = {
        user: this.userId,
        product: product._id,
        quantity: 1,
      };

      this.http.post('http://localhost:5000/api/v1/cart', cartItem).subscribe(
        (response) => {
          console.log('Product added to cart:', response);
        },
        (error) => {
          console.error('Error adding product to cart:', error);
        }
      );
    } else {
      // User is not logged in, add product to cart in localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex(
        (item: any) => item.productId === product._id
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          product: product,
          productId: product._id,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Product added to local cart:', product);
    }
  }
}
