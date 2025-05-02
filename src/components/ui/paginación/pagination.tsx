import ReactPaginate from "react-paginate";

interface PaginacionProps {
    totalRecords: number;
    pageSize: number;
    handlePageClick: (selectedPage: number) => void;
}

export const Paginacion = ({ totalRecords, pageSize, handlePageClick }: PaginacionProps) => {
    const pageCount = Math.ceil(totalRecords / pageSize);   
    return (
        <div className="flex justify-center mt-4">
            <ReactPaginate
                className="text-black flex "
                previousLabel={'← Anterior'}
                nextLabel={'Siguiente →'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={({ selected }) => handlePageClick(selected + 1)}
                containerClassName={'pagination flex space-x-2'}
                pageClassName={'border border-black px-4 py-2 rounded-md cursor-pointer'}
                activeClassName={'bg-blue-500 text-white'}
                previousClassName={'border border-black px-4 py-2 rounded-md cursor-pointer'}
                nextClassName={'border border-black px-4 py-2 rounded-md cursor-pointer'}
                disabledClassName={'opacity-50 cursor-not-allowed'}
            />
        </div>
    );
};
