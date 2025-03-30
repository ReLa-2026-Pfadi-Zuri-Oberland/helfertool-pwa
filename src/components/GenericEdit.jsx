import React, { useState } from 'react';

import Button from './assets/Button';

export const GenericEdit = ({
  useFirebase,
  name,
  updateFunction,
  addFunction,
  removeFunction,
}) => {
  const [items, loading, error] = useFirebase();
  const [updates, setUpdates] = useState({}); // Store local updates

  if (loading) return <h3>Loading...</h3>;
  if (error)
    return (
      <h3>
        Error with {name}: {error.message}
      </h3>
    );

  return (
    <div>
      <h1>{name + 's'}</h1>
      {items &&
        items.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: '20px',
              padding: '10px',
              borderBottom: '1px solid #ccc',
            }}
          >
            <h2>
              {name} {index + 1}
            </h2>
            {Object.keys(item)
              .sort() // Sort keys alphabetically
              .map((key) =>
                key !== 'id' ? (
                  <div key={key}>
                    <h3>
                      {key}: -- {Array.isArray(item[key]) ? 'Array' : item[key]}
                    </h3>
                    {Array.isArray(item[key]) ? (
                      <h3>{item[key].length} items</h3>
                    ) : (
                      <input
                        value={updates[item.id]?.[key] ?? String(item[key])}
                        style={{
                          backgroundColor: 'lightgray',
                          padding: '5px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                        }}
                        onChange={(e) =>
                          setUpdates((prev) => ({
                            ...prev,
                            [item.id]: {
                              ...(prev[item.id] || {}),
                              [key]: e.target.value,
                            },
                          }))
                        }
                      />
                    )}
                  </div>
                ) : null
              )}
            <Button
              onClick={() => {
                if (updates[item.id]) {
                  updateFunction(item.id, updates[item.id]);
                  setUpdates((prev) => ({ ...prev, [item.id]: {} })); // Clear saved updates
                }
              }}
            >
              Save {name}
            </Button>
            <Button
              onClick={async () => {
                try {
                  await removeFunction(item.id); // Call the remove function with the item's ID
                } catch (error) {
                  console.error('Error removing item:', error);
                }
              }}
            >
              Remove this {name}
            </Button>
          </div>
        ))}

      <Button
        onClick={async () => {
          try {
            await addFunction(); // Call the add function with name and description
          } catch (error) {
            console.error('Error adding item:', error);
          }
        }}
      >
        Create new {name}
      </Button>
    </div>
  );
};
