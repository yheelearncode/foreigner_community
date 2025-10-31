interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '8px', 
      marginBottom: '30px',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '20px'
    }}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          style={{
            padding: '8px 16px',
            border: activeCategory === category ? '2px solid #4A90E2' : '1px solid #ddd',
            borderRadius: '20px',
            backgroundColor: activeCategory === category ? '#E8F4FD' : 'white',
            color: activeCategory === category ? '#4A90E2' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeCategory === category ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}