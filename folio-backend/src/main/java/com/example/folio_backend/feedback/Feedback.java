package com.example.folio_backend.feedback;

import com.example.folio_backend.book.Book;
import com.example.folio_backend.commun.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Feedback extends BaseEntity {

    private Double note;
    private String comment;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
}
