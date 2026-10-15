package com.example.folio_backend.book;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book> {

    @Query("""
        SELECT book
        FROM Book book
        WHERE book.archived = false
        AND book.shareable = true
        AND book.owner.id != :userId
    """)
    Page<Book> findAllDisplayableBooks(Pageable pageable, @Param("userId") Integer userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT book
        FROM Book book
        WHERE book.id = :id
""")
    Optional<Book> findByIdForUpdate(@Param("id") Integer id);
}
