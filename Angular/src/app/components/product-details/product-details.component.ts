import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ApiResponse } from 'src/app/models/apiresponse.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  response: ApiResponse | null = null;
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id!).subscribe((data: ApiResponse) => {
      const response: ApiResponse = data;
      this.product = response.data;
    });
  }

  onBack(): void {
    window.history.back();
  }

  addToCart(product: any): void {
    // Implement add to cart logic here
    console.log(product);
  }
}
