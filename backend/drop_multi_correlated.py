def dropMultiCorrelated(cormat, threshold):
    ##Define threshold to remove pairs of features with correlation coefficient greater than 0.7 or -0.7
    threshold = 0.7

    # Select upper triangle of correlation matrix
    upper = cormat.abs().where(np.triu(np.ones(cormat.shape), k=1).astype(np.bool))

    # Find index of feature columns with correlation greater than threshold
    to_drop = [column for column in upper.columns if any(upper[column] > threshold)]
    for d in to_drop:
        print("Dropping {}....".format(d))
    return to_drop