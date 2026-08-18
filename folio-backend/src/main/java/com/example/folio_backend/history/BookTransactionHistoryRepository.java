package com.example.folio_backend.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {

    @Query("""
        SELECT history
        FROM BookTransactionHistory history
        WHERE history.user.id = :userId

""")
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, @Param("userId")Integer userId);


    @Query("""
        SELECT history
        FROM BookTransactionHistory history
        WHERE history.book.owner.id = :userId

""")
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, @Param("userId") Integer userId);

    @Query("""
        SELECT
        CASE WHEN
            COUNT(h) > 0 THEN true ELSE false END
        FROM BookTransactionHistory h
        WHERE h.user.id = :userId
        AND h.book.id = :bookId
        AND h.returnApproved = false
""")
    boolean isAlreadyBorrowedByUser(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    @Query("""
        SELECT
        CASE WHEN
            COUNT(h) > 0 THEN true ELSE false END
        FROM BookTransactionHistory h
        WHERE h.book.id = :bookId
        AND h.returnApproved = false
""")
    boolean isAlreadyBorrowed(@Param("bookId") Integer bookId);

    @Query("""
        SELECT transaction
        FROM BookTransactionHistory transaction
        WHERE transaction.user.id = :userId
        AND transaction.book.id = :bookId
        AND transaction.returned = false
        AND transaction.returnApproved = false
""")
    Optional<BookTransactionHistory> findByBookIdAndUserId(@Param("bookId")Integer bookId, @Param("userId") Integer userId);

    @Query("""
        SELECT transaction
        FROM BookTransactionHistory transaction
        WHERE transaction.book.owner.id = :ownerId
        AND transaction.book.id = :bookId
        AND transaction.returned = true
        AND transaction.returnApproved = false
""")
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(@Param("bookId") Integer bookId, @Param("ownerId") Integer ownerId);
}
