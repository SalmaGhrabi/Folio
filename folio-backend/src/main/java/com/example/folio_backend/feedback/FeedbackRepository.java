package com.example.folio_backend.feedback;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.PathVariable;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    @Query("""
        SELECT feedback
        FROM Feedback feedback
        WHERE feedback.book.id = :bookId
""")
    Page<Feedback> FindAllByBookId(@PathVariable("bookId") Integer bookId, Pageable pageable);
}
