import {QualitativeFieldOptions} from "../../core/filter/IQualitativeFieldOptions";
import {IQuantitativeFieldOptions} from "../../core/filter/IQuantitativeFieldOptions";
import {FieldOptions} from "../../core/filter/IFieldOptions";
import {WhereType} from "../../core/filter/where.type";
import {OrderByType} from "../../core/filter/order-by.type";

type FilterableFieldsNews = {
  author: QualitativeFieldOptions;
  title: QualitativeFieldOptions;
  storyTitle: QualitativeFieldOptions;
  storyUrl: QualitativeFieldOptions;
  url: QualitativeFieldOptions;
  createdAt: IQuantitativeFieldOptions<Date>;
  active: FieldOptions<boolean>;
  externalId: QualitativeFieldOptions;
  createdAtTS: IQuantitativeFieldOptions<number>;
}

export type WhereNews = WhereType<FilterableFieldsNews>;

export type OrderByNews = OrderByType<FilterableFieldsNews>;
