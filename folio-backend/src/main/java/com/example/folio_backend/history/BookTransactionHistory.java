package com.example.folio_backend.history;

import com.example.folio_backend.commun.BaseEntity;
import jakarta.persistence.Entity;
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
public class BookTransactionHistory extends BaseEntity {

    // user relationship
    // book relationship

    private boolean returned;
    private boolean returnApproved;
}
