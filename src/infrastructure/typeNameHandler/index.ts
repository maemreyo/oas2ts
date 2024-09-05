import * as path from 'path';

// Hàm sinh types cho một schema
export const generateTypesForSchema = (
  schemaName: string,
  schema: any,
  imports: Set<string>, // Nhận Set imports từ bên ngoài để tích lũy
  fileName: string, // Nhận thêm tên file để dùng làm tên interface nếu không có tên rõ ràng
): string => {
  let typeDefinitions = '';

  // Nếu là object với các properties
  if (schema.type === 'object' && schema.properties) {
    const properties = generateProperties(
      schema.properties,
      schema.required || [],
      2, // Mức indent (2 khoảng trắng)
      imports, // Truyền Set imports để theo dõi các $ref
    );

    // Sử dụng tên schema nếu có, nếu không sử dụng tên file
    const interfaceName = schemaName
      ? capitalize(schemaName)
      : capitalize(fileName);
    typeDefinitions += `export interface ${interfaceName} {\n${properties}\n}\n`;
  }

  // Nếu là enum (chuỗi với danh sách enum)
  if (schema.type === 'string' && schema.enum) {
    const enumValues = schema.enum
      .map((val: string) => `${' '.repeat(2)}${capitalize(val)} = '${val}'`)
      .join(',\n');

    // Sử dụng tên schema nếu có, nếu không sử dụng tên file
    const enumName = schemaName ? capitalize(schemaName) : capitalize(fileName);
    typeDefinitions += `export enum ${enumName} {\n${enumValues}\n}\n`;
  }

  // Nếu không có properties hoặc type cụ thể
  if (!schema.type && schema.description) {
    // Sử dụng tên file như một loại type
    const typeName = schemaName ? capitalize(schemaName) : capitalize(fileName);
    typeDefinitions += `// ${schema.description}\nexport type ${typeName} = unknown;\n`;
  }

  return typeDefinitions;
};

// Hàm capitalize chữ cái đầu tiên
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Hàm thêm indent (khoảng trắng hoặc tab) vào chuỗi
const indentString = (str: string, indentLevel: number): string => {
  const indent = ' '.repeat(indentLevel);
  return indent + str;
};

// Hàm sinh properties cho interface với indent và xử lý $ref
const generateProperties = (
  properties: any,
  required: string[],
  indentLevel: number,
  imports: Set<string>,
): string => {
  return Object.keys(properties)
    .map((propName) => {
      const prop = properties[propName];
      const isRequired = required.includes(propName);
      const camelCasePropName = toCamelCase(propName); // Chuyển propName sang camelCase
      const type = resolveType(prop, imports); // Chuyển thêm imports
      return `${indentString(`${camelCasePropName}${isRequired ? '' : '?'}: ${type};`, indentLevel)}`;
    })
    .join('\n');
};
// Hàm giải quyết kiểu dữ liệu cho từng thuộc tính, bao gồm $ref
const resolveType = (prop: any, imports: Set<string>): string => {
  // Nếu thuộc tính là tham chiếu đến một schema khác ($ref)
  if (prop.$ref) {
    const refParts = prop.$ref.split('#');
    const filePath = refParts[0]; // Đường dẫn file từ $ref
    const refType = refParts[1] ? refParts[1].replace('/', '') : ''; // Phần định nghĩa sau dấu #

    if (filePath) {
      // Tạo tên file camelCase từ đường dẫn
      const importFileName = toCamelCase(
        path.basename(filePath, path.extname(filePath)),
      );

      // Nếu không có refType, ta sử dụng tên file như là type mặc định
      const typeName = refType || capitalize(importFileName);
      const importPath = `./${importFileName}`;

      // Thêm dòng import vào Set (tránh trùng lặp)
      imports.add(`import { ${typeName} } from '${importPath}';`);

      // Trả về tên type được tham chiếu
      return typeName;
    }

    return refType || 'any';
  }

  // Các kiểu dữ liệu cơ bản
  if (prop.type === 'string') {
    return 'string';
  }
  if (prop.type === 'integer') {
    return 'number';
  }
  if (prop.type === 'boolean') {
    return 'boolean';
  }
  if (prop.type === 'array') {
    const itemType = resolveType(prop.items, imports); // Truyền imports để tiếp tục xử lý array items
    return `${itemType}[]`;
  }

  // Nếu không xác định được kiểu
  return 'any';
};

// Chuyển đổi tên sang dạng camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
};
