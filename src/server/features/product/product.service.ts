import {
  ProductNotFoundError,
  ProductSkuAlreadyExistsError,
  ProductSlugAlreadyExistsError,
} from "./product.error";
import type {
  CreateProductRequest,
  IProductRepository,
  ProductDetail,
  ProductListItem,
  UpdateProductRequest,
} from "../../shared/product/product.interface";
import type {
  CreateProductRequest as RepoCreateProductRequest,
  UpdateProductRequest as RepoUpdateProductRequest,
} from "../../shared/product/product.dto";
import type { ListProductsQueryRequest } from "../../shared/product/product.dto";

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async listProducts(
    query: ListProductsQueryRequest,
  ): Promise<{ data: ProductListItem[]; stats: { total: number } }> {
    return this.productRepository.findAllProducts(query);
  }

  async getProductById(id: string): Promise<ProductDetail> {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }

  async createProduct(input: CreateProductRequest): Promise<ProductDetail> {
    const existing = await this.productRepository.findAllProducts({
      limit: 1,
      offset: 0,
      includeInactive: true,
    });

    const slugExists = existing.data.some((product) => product.slug === input.slug);

    if (slugExists) {
      throw new ProductSlugAlreadyExistsError();
    }

    const formData: RepoCreateProductRequest = {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      category: input.category,
      isAvailable: input.isAvailable,
      primaryVariant: input.primaryVariant,
      images: input.images ?? [],
    };

    try {
      return await this.productRepository.createProduct(formData);
    } catch (err) {
      if (isUniqueViolation(err, "slug")) {
        throw new ProductSlugAlreadyExistsError();
      }

      if (isUniqueViolation(err, "sku")) {
        throw new ProductSkuAlreadyExistsError();
      }

      console.error("[createProduct] insert failed", err);
      throw err;
    }
  }

  async updateProduct(
    id: string,
    input: UpdateProductRequest,
  ): Promise<ProductDetail> {
    await this.getProductById(id);

    const formData: RepoUpdateProductRequest = {
      name: input.name,
      slug: input.slug,
      description: input.description,
      category: input.category,
      isAvailable: input.isAvailable,
      variants: input.variants,
      images: input.images ?? [],
    };

    try {
      return await this.productRepository.updateProduct(id, formData);
    } catch (err) {
      if (isUniqueViolation(err, "slug")) {
        throw new ProductSlugAlreadyExistsError();
      }

      if (isUniqueViolation(err, "sku")) {
        throw new ProductSkuAlreadyExistsError();
      }

      console.error("[updateProduct] update failed", err);
      throw err;
    }
  }

  async archiveProduct(id: string): Promise<void> {
    await this.getProductById(id);

    await this.productRepository.setProductAvailable(id, false);
  }
}

function isUniqueViolation(err: unknown, field: string): boolean {
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  ) {
    const detail = (err as { detail?: string }).detail ?? "";

    return detail.toLowerCase().includes(field.toLowerCase());
  }

  return false;
}
