import { useParams } from 'react-router-dom';

const useWorkplaceId = () => {
    const { id } = useParams();
    
    return id;
};

export default useWorkplaceId;
