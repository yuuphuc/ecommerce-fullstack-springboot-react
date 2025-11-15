package com.example.demo.util;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String[] PRODUCT_HEADERS = { "ID", "Name", "Description", "Price", "Quantity", "ImageUrl", "CategoryId" };
    static String[] CATEGORY_HEADERS = { "ID", "Name" };
    static String PRODUCT_SHEET = "Products";
    static String CATEGORY_SHEET = "Categories";

    /**
     * Kiểm tra file có phải Excel không
     */
    public static boolean hasExcelFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    /**
     * EXPORT Products ra Excel (1 sheet)
     */
    public static ByteArrayInputStream productsToExcel(List<Product> products) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(PRODUCT_SHEET);

            // Header row
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < PRODUCT_HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(PRODUCT_HEADERS[col]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            // Data rows
            int rowIdx = 1;
            for (Product product : products) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(product.getId());
                row.createCell(1).setCellValue(product.getName());
                row.createCell(2).setCellValue(product.getDescription());
                row.createCell(3).setCellValue(product.getPrice());
                row.createCell(4).setCellValue(product.getQuantity());
        row.createCell(5).setCellValue(product.getImageUrl());
        // Safely handle possible null category or null category id to avoid auto-unboxing NPE
        Integer catId = (product.getCategory() != null) ? product.getCategory().getId() : null;
        row.createCell(6).setCellValue(catId != null ? catId.toString() : "");

            }

            // Auto-size columns
            for (int i = 0; i < PRODUCT_HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export products to Excel: " + e.getMessage());
        }
    }

    /**
     * EXPORT Products + Categories ra Excel (2 sheets) - NÂNG CAO
     */
    public static ByteArrayInputStream productsAndCategoriesToExcel(
            List<Product> products,
            List<Category> categories) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Sheet 1: Products
            Sheet productSheet = workbook.createSheet(PRODUCT_SHEET);
            Row productHeaderRow = productSheet.createRow(0);
            for (int col = 0; col < PRODUCT_HEADERS.length; col++) {
                Cell cell = productHeaderRow.createCell(col);
                cell.setCellValue(PRODUCT_HEADERS[col]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            int productRowIdx = 1;
            for (Product product : products) {
                Row row = productSheet.createRow(productRowIdx++);
                row.createCell(0).setCellValue(product.getId());
                row.createCell(1).setCellValue(product.getName());
                row.createCell(2).setCellValue(product.getDescription());
                row.createCell(3).setCellValue(product.getPrice());
                row.createCell(4).setCellValue(product.getQuantity());
                row.createCell(5).setCellValue(product.getImageUrl());
                // Avoid passing Integer/null to setCellValue (it would try to unbox to a numeric overload)
                Integer prodCatId = (product.getCategory() != null) ? product.getCategory().getId() : null;
                row.createCell(6).setCellValue(prodCatId != null ? prodCatId.toString() : "");
            }

            for (int i = 0; i < PRODUCT_HEADERS.length; i++) {
                productSheet.autoSizeColumn(i);
            }

            // Sheet 2: Categories
            Sheet categorySheet = workbook.createSheet(CATEGORY_SHEET);
            Row categoryHeaderRow = categorySheet.createRow(0);
            for (int col = 0; col < CATEGORY_HEADERS.length; col++) {
                Cell cell = categoryHeaderRow.createCell(col);
                cell.setCellValue(CATEGORY_HEADERS[col]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            int categoryRowIdx = 1;
            for (Category category : categories) {
                Row row = categorySheet.createRow(categoryRowIdx++);
                row.createCell(0).setCellValue(category.getId());
                row.createCell(1).setCellValue(category.getName());
            }

            for (int i = 0; i < CATEGORY_HEADERS.length; i++) {
                categorySheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export data to Excel: " + e.getMessage());
        }
    }

    /**
     * IMPORT Products từ Excel
     */
    public static List<Product> excelToProducts(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet(PRODUCT_SHEET);

            if (sheet == null) {
                sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên nếu không tìm thấy
            }

            Iterator<Row> rows = sheet.iterator();
            List<Product> products = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Product product = new Product();
                Iterator<Cell> cellsInRow = currentRow.iterator();

                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        case 0: // ID - skip or read
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                product.setId((int) currentCell.getNumericCellValue());
                            }
                            break;
                        case 1: // Name
                            product.setName(currentCell.getStringCellValue());
                            break;
                        case 2: // Description
                            product.setDescription(getCellValueAsString(currentCell));
                            break;
                        case 3: // Price
                            product.setPrice(currentCell.getNumericCellValue());
                            break;
                        case 4: // Quantity
                            product.setQuantity((int) currentCell.getNumericCellValue());
                            break;
                        case 5: // ImageUrl
                            product.setImageUrl(getCellValueAsString(currentCell));
                            break;
                        case 6: // CategoryId
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                Category category = new Category();
                                category.setId((int) currentCell.getNumericCellValue());
                                product.setCategory(category);
                            }
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }

                products.add(product);
                rowNumber++;
            }

            workbook.close();
            return products;
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }

    /**
     * Helper: Tạo style cho header
     */
    private static CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    /**
     * Helper: Lấy giá trị cell dạng String
     */
    private static String getCellValueAsString(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}