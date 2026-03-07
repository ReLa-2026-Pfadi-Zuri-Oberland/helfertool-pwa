import { useState, useEffect } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import WhiteCard from '../../../../components/ui/WhiteCard';
import Button from '../../../../components/ui/Button';

const COLLECTIONS = [
  'Users',
  'Engagements',
  'JobTypes',
  'Locations',
  'Organizations',
  'Shifts',
];

const DocumentManager = () => {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bulkData, setBulkData] = useState('');
  const [bulkInsertMode, setBulkInsertMode] = useState(false);
  const [bulkUpdateMode, setBulkUpdateMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load documents from selected collection
  const loadDocuments = async (collectionName) => {
    if (!collectionName) return;

    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docs);
    } catch (err) {
      setError(`Error loading documents: ${err.message}`);
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle collection selection
  const handleCollectionChange = (collectionName) => {
    setSelectedCollection(collectionName);
    setDocuments([]);
    setError(null);
    setSuccessMessage('');
    setBulkInsertMode(false);
    setBulkUpdateMode(false);
    setBulkData('');
  };

  // Load all documents from all collections
  const loadAllDocuments = async () => {
    setLoading(true);
    setError(null);
    setSelectedCollection('ALL');

    try {
      const allDocs = [];

      for (const collectionName of COLLECTIONS) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          collection: collectionName,
          ...doc.data(),
        }));
        allDocs.push(...docs);
      }

      setDocuments(allDocs);
    } catch (err) {
      setError(`Error loading all documents: ${err.message}`);
      console.error('Error loading all documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk insert
  const handleBulkInsert = async () => {
    if (!selectedCollection || selectedCollection === 'ALL') {
      setError('Please select a specific collection for bulk insert');
      return;
    }

    if (!bulkData.trim()) {
      setError('Please enter JSON data for bulk insert');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const data = JSON.parse(bulkData);
      const dataArray = Array.isArray(data) ? data : [data];

      if (dataArray.length === 0) {
        setError('No data to insert');
        setLoading(false);
        return;
      }

      // Use batch for better performance
      const batch = writeBatch(db);
      const collectionRef = collection(db, selectedCollection);

      dataArray.forEach((item) => {
        const docRef = doc(collectionRef);
        batch.set(docRef, item);
      });

      await batch.commit();

      setSuccessMessage(
        `Successfully inserted ${dataArray.length} document(s) into ${selectedCollection}`,
      );
      setBulkData('');
      setBulkInsertMode(false);

      // Reload documents
      await loadDocuments(selectedCollection);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input.');
      } else {
        setError(`Error inserting documents: ${err.message}`);
      }
      console.error('Error inserting documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk update
  const handleBulkUpdate = async () => {
    if (!selectedCollection || selectedCollection === 'ALL') {
      setError('Please select a specific collection for bulk update');
      return;
    }

    if (!bulkData.trim()) {
      setError('Please enter JSON data for bulk update');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const data = JSON.parse(bulkData);
      const dataArray = Array.isArray(data) ? data : [data];

      if (dataArray.length === 0) {
        setError('No data to update');
        setLoading(false);
        return;
      }

      // Validate that all items have an 'id' field
      const missingIds = dataArray.filter((item) => !item.id);
      if (missingIds.length > 0) {
        setError('All documents must have an "id" field for bulk update');
        setLoading(false);
        return;
      }

      // Use batch for better performance
      const batch = writeBatch(db);

      dataArray.forEach((item) => {
        const { id, ...updateData } = item;
        const docRef = doc(db, selectedCollection, id);
        batch.update(docRef, updateData);
      });

      await batch.commit();

      setSuccessMessage(
        `Successfully updated ${dataArray.length} document(s) in ${selectedCollection}`,
      );
      setBulkData('');
      setBulkUpdateMode(false);

      // Reload documents
      await loadDocuments(selectedCollection);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input.');
      } else {
        setError(`Error updating documents: ${err.message}`);
      }
      console.error('Error updating documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle remove duplicates
  const handleRemoveDuplicates = async () => {
    if (!selectedCollection || selectedCollection === 'ALL') {
      setError('Please select a specific collection to remove duplicates');
      return;
    }

    if (documents.length === 0) {
      setError('No documents loaded. Please load the collection first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Create a map to track unique documents based on their data (excluding id)
      const uniqueMap = new Map();
      const duplicateIds = [];
      const mismatchedIds = [];

      documents.forEach((document) => {
        const { id, ...data } = document;

        // Check if document has an 'id' field in its data that doesn't match the document ID
        if (data.id && data.id !== id) {
          mismatchedIds.push(id);
          return; // Skip this document from duplicate check
        }

        const dataString = JSON.stringify(data);

        if (uniqueMap.has(dataString)) {
          // This is a duplicate, mark for deletion
          duplicateIds.push(id);
        } else {
          // First occurrence, keep it
          uniqueMap.set(dataString, id);
        }
      });

      const totalToDelete = duplicateIds.length + mismatchedIds.length;

      if (totalToDelete === 0) {
        setSuccessMessage(
          'No duplicates or mismatched IDs found in this collection.',
        );
        setLoading(false);
        return;
      }

      // Build confirmation message
      let confirmMessage = '';
      if (duplicateIds.length > 0) {
        confirmMessage += `Found ${duplicateIds.length} duplicate document(s).\n`;
      }
      if (mismatchedIds.length > 0) {
        confirmMessage += `Found ${mismatchedIds.length} document(s) where document ID doesn't match data.id field.\n`;
      }
      confirmMessage +=
        '\nDo you want to delete them?\n\nThis action cannot be undone.';

      // Confirm with user
      const confirmed = window.confirm(confirmMessage);

      if (!confirmed) {
        setLoading(false);
        return;
      }

      // Delete duplicates and mismatched IDs using batch
      const batch = writeBatch(db);
      const allIdsToDelete = [...duplicateIds, ...mismatchedIds];

      allIdsToDelete.forEach((id) => {
        const docRef = doc(db, selectedCollection, id);
        batch.delete(docRef);
      });

      await batch.commit();

      let successMsg = `Successfully removed ${totalToDelete} document(s) from ${selectedCollection}`;
      if (duplicateIds.length > 0 && mismatchedIds.length > 0) {
        successMsg += ` (${duplicateIds.length} duplicates, ${mismatchedIds.length} ID mismatches)`;
      } else if (duplicateIds.length > 0) {
        successMsg += ` (duplicates)`;
      } else {
        successMsg += ` (ID mismatches)`;
      }

      setSuccessMessage(successMsg);

      // Reload documents
      await loadDocuments(selectedCollection);
    } catch (err) {
      setError(`Error removing duplicates: ${err.message}`);
      console.error('Error removing duplicates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to load documents when collection changes
  useEffect(() => {
    if (selectedCollection && selectedCollection !== 'ALL') {
      loadDocuments(selectedCollection);
    }
  }, [selectedCollection]);

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Document Manager</h1>

      {/* Collection Selection */}
      <WhiteCard className='mb-6'>
        <h2 className='text-xl font-semibold mb-4'>Select Collection</h2>
        <div className='flex flex-wrap gap-2 mb-4'>
          <Button
            onClick={loadAllDocuments}
            className={`${selectedCollection === 'ALL' ? 'bg-blue-600' : 'bg-gray-500'}`}
          >
            All Collections
          </Button>
          {COLLECTIONS.map((collectionName) => (
            <Button
              key={collectionName}
              onClick={() => handleCollectionChange(collectionName)}
              className={`${selectedCollection === collectionName ? 'bg-blue-600' : 'bg-gray-500'}`}
            >
              {collectionName}
            </Button>
          ))}
        </div>

        {selectedCollection && selectedCollection !== 'ALL' && (
          <div className='mt-4 flex flex-wrap gap-2'>
            <Button
              onClick={() => {
                setBulkInsertMode(!bulkInsertMode);
                if (!bulkInsertMode) setBulkUpdateMode(false);
              }}
              className='bg-green-600'
            >
              {bulkInsertMode ? 'Cancel Bulk Insert' : 'Bulk Insert'}
            </Button>
            <Button
              onClick={() => {
                setBulkUpdateMode(!bulkUpdateMode);
                if (!bulkUpdateMode) setBulkInsertMode(false);
              }}
              className='bg-yellow-600'
            >
              {bulkUpdateMode ? 'Cancel Bulk Update' : 'Bulk Update'}
            </Button>
            <Button
              onClick={handleRemoveDuplicates}
              disabled={loading || documents.length === 0}
              className='bg-red-600'
            >
              Remove Duplicates
            </Button>
          </div>
        )}
      </WhiteCard>

      {/* Bulk Insert Section */}
      {bulkInsertMode && (
        <WhiteCard className='mb-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Bulk Insert into {selectedCollection}
          </h2>
          <p className='text-sm text-gray-600 mb-4'>
            Enter JSON data (single object or array of objects):
          </p>
          <textarea
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder={`Example:\n[\n  {"field1": "value1", "field2": "value2"},\n  {"field1": "value3", "field2": "value4"}\n]`}
            className='w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm'
            disabled={loading}
          />
          <div className='mt-4 flex gap-2'>
            <Button
              onClick={handleBulkInsert}
              disabled={loading}
              className='bg-green-600'
            >
              {loading ? 'Inserting...' : 'Insert Documents'}
            </Button>
            <Button
              onClick={() => {
                setBulkInsertMode(false);
                setBulkData('');
              }}
              className='bg-gray-500'
            >
              Cancel
            </Button>
          </div>
        </WhiteCard>
      )}

      {/* Bulk Update Section */}
      {bulkUpdateMode && (
        <WhiteCard className='mb-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Bulk Update in {selectedCollection}
          </h2>
          <p className='text-sm text-gray-600 mb-4'>
            Enter JSON data (array of objects with "id" field):
          </p>
          <textarea
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder={`Example:\n[\n  {"id": "doc1", "field1": "newValue1"},\n  {"id": "doc2", "field1": "newValue2"}\n]`}
            className='w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm'
            disabled={loading}
          />
          <div className='mt-4 flex gap-2'>
            <Button
              onClick={handleBulkUpdate}
              disabled={loading}
              className='bg-yellow-600'
            >
              {loading ? 'Updating...' : 'Update Documents'}
            </Button>
            <Button
              onClick={() => {
                setBulkUpdateMode(false);
                setBulkData('');
              }}
              className='bg-gray-500'
            >
              Cancel
            </Button>
          </div>
        </WhiteCard>
      )}

      {/* Messages */}
      {error && (
        <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      {successMessage && (
        <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
          {successMessage}
        </div>
      )}

      {/* Documents Display */}
      <WhiteCard>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {selectedCollection
              ? `Documents in ${selectedCollection}`
              : 'Select a collection'}
          </h2>
          {selectedCollection && (
            <span className='text-sm text-gray-600'>
              Total: {documents.length} document(s)
            </span>
          )}
        </div>

        {loading && (
          <div className='text-center py-8'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
            <p className='mt-2 text-gray-600'>Loading documents...</p>
          </div>
        )}

        {!loading && documents.length === 0 && selectedCollection && (
          <p className='text-gray-500 text-center py-8'>No documents found</p>
        )}

        {!loading && documents.length > 0 && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  {selectedCollection === 'ALL' && (
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Collection
                    </th>
                  )}
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {documents.map((doc, index) => (
                  <tr
                    key={`${doc.collection || selectedCollection}-${doc.id}-${index}`}
                    className='hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {doc.id}
                    </td>
                    {selectedCollection === 'ALL' && (
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <span className='px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                          {doc.collection}
                        </span>
                      </td>
                    )}
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      <pre className='whitespace-pre-wrap break-words max-w-2xl'>
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(doc).filter(
                              ([key]) => key !== 'id' && key !== 'collection',
                            ),
                          ),
                          null,
                          2,
                        )}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </WhiteCard>
    </div>
  );
};

export default DocumentManager;

// Made with Bob
