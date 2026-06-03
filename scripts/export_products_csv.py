from __future__ import annotations

import argparse
import ast
import csv
import json
import re
from pathlib import Path


DEFAULT_HEADERS = [
    'id',
    'slug',
    'title',
    'description',
    'price',
    'images',
    'status',
    'availableDate',
    'quantity',
    'category',
    'originalLink',
]


def parse_products(source_path: Path) -> list[dict[str, object]]:
    text = source_path.read_text(encoding='utf-8')
    start_marker = 'export const products: Product[] = ['
    start = text.index(start_marker) + len(start_marker) - 1
    end = text.rindex('];')
    array_text = text[start : end + 1]

    uncommented = re.sub(r'(?m)^(\s*)//\s?', r'\1', array_text)
    normalized = re.sub(
        r'(?m)(^|[,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:',
        lambda match: f"{match.group(1)}'{match.group(2)}':",
        uncommented,
    )
    normalized = normalized.replace('true', 'True')
    normalized = normalized.replace('false', 'False')
    normalized = normalized.replace('null', 'None')

    products = ast.literal_eval(normalized)
    if not isinstance(products, list):
        raise ValueError('Expected products export to be a list.')

    return products


def serialize_product(product: dict[str, object]) -> dict[str, object]:
    return {
        'id': product.get('id', ''),
        'slug': product.get('slug', ''),
        'title': product.get('title', ''),
        'description': product.get('description', ''),
        'price': '' if product.get('price') is None else product.get('price', ''),
        'images': json.dumps(product.get('images', []), ensure_ascii=False),
        'status': product.get('status', ''),
        'availableDate': product.get('availableDate', ''),
        'quantity': '' if product.get('quantity') is None else product.get('quantity', ''),
        'category': json.dumps(product.get('category', []), ensure_ascii=False),
        'originalLink': product.get('originalLink', ''),
    }


def export_csv(source_path: Path, output_path: Path) -> int:
    products = parse_products(source_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=DEFAULT_HEADERS,
            delimiter=';',
            quoting=csv.QUOTE_ALL,
        )
        writer.writeheader()
        for product in products:
            writer.writerow(serialize_product(product))

    return len(products)


def main() -> None:
    project_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(
        description='Exporta data/products.ts para data/data.csv, incluindo itens comentados.',
    )
    parser.add_argument(
        '--source',
        type=Path,
        default=project_root / 'data' / 'products.ts',
        help='Arquivo products.ts de origem.',
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=project_root / 'data' / 'data.csv',
        help='Arquivo CSV de saída.',
    )
    args = parser.parse_args()

    source_path = args.source.resolve()
    output_path = args.output.resolve()
    count = export_csv(source_path, output_path)
    print(f'Exported {count} items to {output_path}')


if __name__ == '__main__':
    main()