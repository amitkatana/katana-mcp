package translation

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type Store struct {
	db *sqlx.DB
}

func NewStore(db *sqlx.DB) Store {
	return Store{
		db: db,
	}

}

func (s Store) ProductGeneralFieldTranslations(ctx context.Context, productId int) ([]LocaleRow, error) {

	rows := []LocaleRow{}
	query := `
		SELECT
			lp.LanguageId,
			lp.LocaleKey,
			lp.LocaleValue,
		(select l.LanguageCulture  from Language l where l.Id =lp.LanguageId) as LanguageCulture
		FROM LocalizedProperty lp
		WHERE lp.EntityId = @p1
		  AND lp.LocaleKeyGroup = 'Product'
		  AND lp.LocaleKey IN ('ShortDescription', 'FullDescription','Name')
	`
	err := s.db.SelectContext(ctx, &rows, query, productId)

	if err != nil {
		return nil, err
	}

	return rows, nil
}

func (s Store) UpdateProductTranslation(ctx context.Context, product_id, language_id int, key, translation string) (bool, error) {

	query := `UPDATE LocalizedProperty
		SET LocaleValue = :newValue
		WHERE EntityId = :entityId
		  AND LanguageId = :languageId
		  AND LocaleKeyGroup = 'Product'
		  AND LocaleKey = :localeKey`

	args := map[string]interface{}{
		"newValue":   translation,
		"entityId":   product_id,
		"languageId": language_id,
		"localeKey":  key,
	}

	result, err := s.db.NamedExecContext(ctx, query, args)
	if err != nil {
		return false, fmt.Errorf("update product translation: %w", err)
	}
	fmt.Println("Product Translations Update!!!")

	rows, err := result.RowsAffected()
	if err != nil {
		return false, fmt.Errorf("rows affected: %w", err)
	}

	return rows > 0, nil

}
