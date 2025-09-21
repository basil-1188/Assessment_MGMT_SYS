export function getValueFromPath(obj, path) {
  if (!obj || !path) return undefined;
  
  if (path.includes('[?(@')) {
    return handleArrayQuery(obj, path);
  }
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    if (part.includes('[') && part.includes(']')) {
      const arrayName = part.split('[')[0];
      const index = parseInt(part.match(/\[(\d+)\]/)[1]);
      
      if (Array.isArray(current[arrayName])) {
        current = current[arrayName][index];
      } else {
        return undefined;
      }
    } 
    else {
      current = current[part];
    }
  }
  
  return current;
}

function handleArrayQuery(obj, path) {
  const match = path.match(/(\w+)\[\?\(@\.(\w+)==(['"]?)(\w+)\3\)\](?:\.(.+))?/);
  if (!match) return undefined;
  
  const [, arrayName, field, , value, restPath] = match;
  const array = obj[arrayName];
  
  if (!Array.isArray(array)) return undefined;
  
  const item = array.find(i => {
    const fieldValue = i[field];
    return fieldValue != null && fieldValue.toString() === value;
  });
  
  if (!item) return undefined;
    return restPath ? getValueFromPath(item, restPath) : item;
}

export function classifyValue(value, ranges) {
  if (value === undefined || value === null || !ranges) return null;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return null;
  
  for (const range of ranges) {
    if (numValue >= range.min && numValue <= range.max) {
      return range;
    }
  }
  
  return null;
}

export function extractFieldData(session, fieldConfig) {
  let value;
  
  if (Array.isArray(fieldConfig.path)) {
    const values = fieldConfig.path.map(path => getValueFromPath(session, path));
    value = fieldConfig.format ? fieldConfig.format(...values) : values.join(' / ');
  } 
  else {
    value = getValueFromPath(session, fieldConfig.path);
  }
  
  const classification = fieldConfig.classification ? 
    classifyValue(value, fieldConfig.classification.ranges) : null;
  
  return {
    label: fieldConfig.label,
    value: value !== undefined && value !== null ? value : 'N/A',
    unit: fieldConfig.unit || '',
    classification: classification
  };
}